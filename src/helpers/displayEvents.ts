import { EventWithParts } from "@/db/events";

// TODO: Does FullCalendar have a built-in type for this?
// Yes, I think so:
// import { EventInput } from "@fullcalendar/core";
// https://github.com/fullcalendar/fullcalendar-examples/tree/main/react18-typescript

export type FullCalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string;
}

export const EVENT_PART_ID_DELIMITER = "|PartID:";

export default function displayEvents(events: EventWithParts[]): FullCalendarEvent[] {
  
  if (!events || events.length === 0) {
    return [];
  } 

  const displayEvents: FullCalendarEvent[] = []
  for (const event of events) {
    for (const part of event.parts) {
      displayEvents.push({
        id: event.id + EVENT_PART_ID_DELIMITER + part.id,
        start: part.start,
        end: part.end,
        title: event.title,
        color: event.isAppointment ? "green" : "blue",
      });
    }
  }
  return displayEvents
}
