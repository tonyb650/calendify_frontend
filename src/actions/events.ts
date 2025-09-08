"use server"

import { createEvent, deleteEvent, EventWithParts, updateEvent } from "@/db/events";
import { createPart, deletePart, updatePart } from "@/db/parts";
import type { Event } from "@/generated/prisma";
import { generateDateObject, getEndTime } from "@/lib/dateUtils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type FormError = {title?: string[], start?: string[], duration?: string[], startTime?: string[], endTime?: string[]}


type EventActionResponse = {
  success?: boolean
  error?: FormError
  data?: Event
}

const createEventSchema = z.object({
  title: z.string().max(255, "Title too long").min(2, "Title too short"),
  startDate: z.string().regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format (e.g., 17:30)").optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format (e.g., 17:30)").optional(),
  duration: z.number().max(10080, "Events longer than one week are not currently supported").optional(),
  isAppointment: z.coerce.boolean(),
  isBreakable: z.coerce.boolean(),
})

const updateEventSchema = createEventSchema.extend({
  id: z.preprocess(
    (val) => typeof val === 'string' ? val.trim() : val,
    z.string().min(1).max(255)
  )
})

const ARBITRARY_START_TIME = "12:00" // <-- This is an arbitrary time used to generate the start time for auto-scheduled events. Will not be needed once we have a prediction system in place.

/*********************************/
/****** CREATE Event Action ******/
/*********************************/
export async function createEventAction(prevState: EventActionResponse, formData: FormData): Promise<EventActionResponse> {

  console.log("createEventAction prevState:", prevState);

  const {success, data, error} = createEventSchema.safeParse({
    title: formData.get("title"),
    startDate: formData.get("startDate"),
    startTime: formData.get("startTime") || undefined,
    endTime: formData.get("endTime") || undefined,
    duration: Number(formData.get("duration")),
    isAppointment: formData.get("autoSchedule") as string !== "on",
    isBreakable: formData.get("isBreakable") as string === "on",
  })

  if (!success) {
    console.log("Zod validation failed")
    console.log(error?.flatten().fieldErrors)
    return {error: error?.flatten().fieldErrors}
  }

  if (data.isAppointment === true) {
    /* Appointment events require a start and end time but no duration or isBreakable value */

    if (!data.startTime) {
      return {error: {startTime: ["Start time is required for appointments"]}}
    }
    if (!data.endTime) {
      return {error: {endTime: ["End time is required for appointments"]}}
    }

    const start = generateDateObject(data.startDate, data.startTime)
    const end = generateDateObject(data.startDate, data.endTime)
  
  
    const event: EventWithParts = await createEvent({
      title: data.title, 
      isAppointment: data.isAppointment, // will always be true
      isBreakable: data.isBreakable,     // should always be false
    })
  
    await createPart({
      eventId: event.id,
      start,
      end,
    })

  } else {
    /* AutoScheduled events require a start date and duration but no set end time */
    
    if (!data.duration || data.duration <= 0) {
      return {error: {duration: ["Duration must be a positive number"]}}
    }

    /*
      TODO: New logic around predictions that handle breakable events will need to go here
      const prediction = await getPrediction(data.startDate, data.duration, data.isBreakable)
      if(prediction == null) {
        return {error: {title: ["Prediction failed"]}}
      }
    */
  
    const event: EventWithParts = await createEvent({
      title: data.title, 
      isAppointment: data.isAppointment, // will always be false
      isBreakable: data.isBreakable,     // can be true or false
    })


  
    /* To demonstrate breakable events, if the duration is >= 60 minutes, we split into 2 equal parts */
    if (data.isBreakable === false || data.duration < 60) {
      /* One part only */
      const start = generateDateObject(data.startDate, ARBITRARY_START_TIME)
      const end = getEndTime(start, data.duration)
      
      const part = await createPart({
        eventId: event.id,
        start,
        end
      })
      console.log("Created part:", part)
    } else {
      /* TODO Multiple Equal Parts */
      const start1 = generateDateObject(data.startDate, ARBITRARY_START_TIME)
      const duration1 = Math.floor(data.duration / 2)
      const end1 = getEndTime(start1, duration1)
      const start2 = end1
      const duration2 = data.duration - duration1
      const end2 = getEndTime(start2, duration2)
      
      const part1 = await createPart({
        eventId: event.id,
        start: start1,
        end: end1
      })
      const part2 = await createPart({
        eventId: event.id,
        start: start2,
        end: end2
      })
      console.log("Created parts:", part1, part2)
    }
  }
    
  revalidatePath('/')
  return {success: true}
}

/*********************************/
/****** UPDATE Event Action ******/
/*********************************/
export async function updateEventAction(prevState: EventActionResponse, formData: FormData): Promise<EventActionResponse> {
  
  const {success, data, error} = updateEventSchema.safeParse({
    id: prevState.data?.id,
    title: formData.get("title"),
    startDate: formData.get("startDate"),
    startTime: formData.get("startTime") || undefined,
    endTime: formData.get("endTime") || undefined,
    duration: Number(formData.get("duration")),
    isAppointment: formData.get("autoSchedule") as string !== "on",
    isBreakable: formData.get("isBreakable") as string === "on",
  })
    
  if (!success) {
    console.log(error?.flatten().fieldErrors)
    return {error: error?.flatten().fieldErrors}
    }
    

    if (data.isAppointment === true) {
    /* UPDATE an APPOINTMENT (not auto-scheduled) */
    /* REQUIRED: a startTime and endTime. NOT REQUIRED: duration or isBreakable value */
  
    if (!data.startTime) {
      return {error: {startTime: ["Start time is required for appointments"]}}
    }

    if (!data.endTime) {
      return {error: {endTime: ["End time is required for appointments"]}}
    }

    const start = generateDateObject(data.startDate, data.startTime)
    const end = generateDateObject(data.startDate, data.endTime)

    const event: EventWithParts = await updateEvent({
      id: data.id,
      title: data.title, 
      isAppointment: true,
      isBreakable: false,
    })

    if (!event) {
      throw new Error("Event not found or could not be updated");
    }

    if (event.parts.length === 0) {
      // If no parts exist, create a new one
      console.warn("Unexpected situation. Event has no existing parts. Creating a new part.")
      await createPart({
        eventId: event.id,
        start,
        end
      })
    } else if (event.parts.length === 1) {
      const [part] = event.parts

      await updatePart({
        partId: part.id,
        start,
        end
      })
    } else {
      // There are multiple parts. Delete all but the first one and update the first part
      // console.warn("Multiple parts found for appointment event, deleting all but the first part")

      for (const part of event.parts.slice(1)) {
        await deletePart(part.id);
      }
      await updatePart({
        partId: event.parts[0].id,
        start,
        end
      })
    }

  } else {
    /* UPDATE an AUTO-SCHEDULED event */
    /* REQUIRED: a startDate and duration. NOT REQUIRED: startTime and endTime */
    
    if (!data.duration || data.duration <= 0) {
      return {error: {duration: ["Duration must be a positive number"]}}
    }
  
    const event: EventWithParts = await updateEvent({
      id: data.id,
      title: data.title, 
      isAppointment: false, 
      isBreakable: data.isBreakable, 
    })

    if (!event) {
      throw new Error("Event not found or could not be updated");
    }

    // Delete all existing parts for the event
    for (const part of event.parts) {
      await deletePart(part.id);
    }
  
    /* To demonstrate breakable events, if the duration is >= 60 minutes, we split into 2 equal parts */
    if (data.isBreakable === false || data.duration < 60) {
      /* One part only */

      const start = generateDateObject(data.startDate, data.startTime || ARBITRARY_START_TIME)
      const end = getEndTime(start, data.duration)
      
      const part = await createPart({
        eventId: event.id,
        start,
        end
      })
      console.log("Created part:", part)
    } else {
      /* TODO Multiple Equal Parts */
      const start1 = generateDateObject(data.startDate, ARBITRARY_START_TIME)
      const duration1 = Math.floor(data.duration / 2)
      const end1 = getEndTime(start1, duration1)
      const start2 = end1
      const duration2 = data.duration - duration1
      const end2 = getEndTime(start2, duration2)
      
      const part1 = await createPart({
        eventId: event.id,
        start: start1,
        end: end1
      })
      const part2 = await createPart({
        eventId: event.id,
        start: start2,
        end: end2
      })
      console.log("Created parts:", part1, part2)
    }
  }

  revalidatePath('/')
  return {success: true}
}

/*********************************/
/****** UPDATE "Part" Action *****/
/*********************************/
/* Should we have a separate file for "part" Server Actions? */
export async function updatePartTimes(partId: string, start: Date, end: Date) {

  if (!partId || !start || !end) {
    throw new Error("Invalid part ID, start time or end time");
  }

  await updatePart({ partId, start, end })
} 

/*********************************/
/****** DELETE Event Action ******/
/*********************************/
export async function deleteEventAction(prevState: EventActionResponse, formData: FormData): Promise<EventActionResponse> {
  console.log(formData)
  //TODO validate
  const eventId = prevState.data?.id || ""
  // TODO error if no eventID
  await deleteEvent(eventId)
  revalidatePath('/')
  return {success: true}
}