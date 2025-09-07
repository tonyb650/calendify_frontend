/* Given a Date object and an integer 0-23, return a new Date object for the same day but a time  */
// import { getEvents } from "@/db/events";

/**
 * Creates a Date object for that day based on a 30-minute slot index.
 * The day starts at 12:00 AM (slot 0). Each subsequent slot adds 30 minutes.
 *
 * @param date The date to modify
 * @param slot The time slot index. For example, 0 represents 12:00 AM, 1 represents 12:30 AM.
 * @returns A Date object for today at the time specified by the slot.
 */
export const getDateFromSlot = (date: Date, slot: number): Date => {
  if (slot < 0 || slot > 47) throw new Error("Invalid time slot")
  date.setHours(0, 0, 0, 0); // Set to midnight
  date.setMinutes(slot * 30);
  return date
}

/**
 * Calculates the 30-minute time slot index for a given Date object.
 *
 * @param date - The Date object to extract the time from.
 * @returns The zero-based index of the 30-minute slot in the day (0 for 00:00-00:29, 1 for 00:30-00:59, ..., 47 for 23:30-23:59).
 */
export const getSlotFromDate = (date: Date): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return Math.floor((hours * 60 + minutes) / 30);
}

/**
 * Asynchronously determines the status of 30-minute time slots for a given day.
 *
 * Each slot in the returned array represents a 30-minute interval in the day.
 * A value of `1` indicates that the slot is occupied by an event, while `0` means it is free.
 *
 * @param date - The date for which to check the time slot statuses.
 * @returns A promise that resolves to an array of 48 numbers (0 or 1), representing the status of each 30-minute slot.
 *
 * @remarks
 * - Relies on `getEventsByDay`, `getSlotFromDate`, and `getDurationInMinutes` utility functions.
 * - Assumes that the day is divided into 48 slots of 30 minutes each (i.e., 12 hours).
 */
export const timeSlotStatus = async (date: Date): Promise<number[]> => {
  console.log("timeSlotStatus called with date:", date)
  // const slots = Array(48).fill(0)
  // const events = await getEvents()

  // for (const event of events) {
  //   const eventStartingSlot = getSlotFromDate(event.start)
  //   const duration = getDurationInMinutes(event.start, event.end)
  //   const eventFinalSlot = eventStartingSlot + ~~(duration / 30)
  //   for (let slot = eventStartingSlot; slot < eventFinalSlot; slot++){
  //     slots[slot] = 1
  //   }
  // }
  return []
}