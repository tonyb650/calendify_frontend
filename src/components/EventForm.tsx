'use client'

import { createEventAction, updateEventAction } from "@/actions/events";
import { EventWithParts } from "@/db/events";
import combinedDuration from "@/helpers/combinedDuration";
import { formatDate, formatTime, getEndTime, getNextHourStart } from "@/utils/dateUtils";
import { useActionState, useEffect, useState } from "react";
import { FormGroup } from "./FormGroup";

//! move to user preferences
const USER_PREFERENCE_DEFAULT_APPOINTMENT_DURATION = 30; // default to 30 minutes if no duration is provided

type EventFormProps = {
  onSuccess: () => void,
  event?: EventWithParts,
  defaultDate?: Date,
}

/* event will be passed in when Updating but not when Creating */
export default function EventForm ({event, defaultDate, onSuccess}: EventFormProps) {

  /* useActionState has three parameters
    1) our function that will be called by the returned formAction function
    2) the previous state of our 'response' (here is type of: EventActionResponse)
    3) optionally permalink
  */
  const [response, formAction, isPending] = useActionState( event ? updateEventAction : createEventAction, {data: event}); 
  // TODO: Will need to make StartTime & EndTime controlled because EndTime should be automatically shifted later (or earlier) when startTime is changed
  const [autoSchedule, setAutoSchedule] = useState(event ? !event.isAppointment : true)

  console.log(event, "EventForm event prop")
  
  useEffect(() => {
    if (response.success) {
      onSuccess()
    }
  },[response, onSuccess])

  const earliestPart = event?.parts?.sort((a, b) => a.start.getTime() - b.start.getTime())[0]
  const startDate = earliestPart?.start ? new Date(earliestPart.start) : defaultDate || getNextHourStart(new Date())
  const duration: number | undefined = combinedDuration(event?.parts) || USER_PREFERENCE_DEFAULT_APPOINTMENT_DURATION;
  const endTime = formatTime(getEndTime(startDate, duration))
  
  return (
    <form action={formAction} className="form">
      <FormGroup>
        <label htmlFor="title">Title</label>
        <input
          required
          type="text"
          name="title"
          id="title"
          defaultValue={event?.title}
        />
      </FormGroup>
      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          name="autoSchedule"
          id="autoSchedule"
          checked={autoSchedule}
          onChange={(e) => setAutoSchedule(e.target.checked)}
          />
        <label htmlFor="autoSchedule">Auto Schedule</label>
      </div>
      <FormGroup>
        <label htmlFor="startDate">{ autoSchedule && "Start"} Date</label>
        <input
          required
          type="date"
          name="startDate"
          id="startDate"
          defaultValue={formatDate(startDate)}
        />
      </FormGroup>

      { autoSchedule &&
        <>
          <FormGroup>
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              required
              type="number"
              name="duration"
              id="duration"
              defaultValue={duration}
              />
          </FormGroup>
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="isBreakable"
              id="isBreakable"
              defaultChecked={event?.isBreakable || false}
              />
            <label htmlFor="isBreakable">Breakable</label>
          </div>
        </>
      }
      { !autoSchedule &&
        <>
          <FormGroup>
            <label htmlFor="start">Start Time</label>
            <input
              required
              type="time"
              name="startTime"
              id="startTime"
              defaultValue={formatTime(startDate)}
              />
          </FormGroup>
          <FormGroup>
            <label htmlFor="end">End Time</label>
            <input
              required
              type="time"
              name="endTime"
              id="endTime"
              defaultValue={endTime}
              />
          </FormGroup>
        </>
      }
      <button className="btn">{isPending ? "Submitting" : "Submit"}</button>
    </form>
  );
}