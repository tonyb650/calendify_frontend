'use client'

import { EventWithParts } from "@/db/events"
import displayEvents, { EVENT_PART_ID_DELIMITER } from "@/helpers/displayEvents"
import type { EventChangeArg, EventClickArg, ViewMountArg } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import interaction, { DateClickArg } from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useEffect, useState } from "react"

import { updatePartTimes } from "@/actions/events"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"
import Modal from "@/components/Modal"
import EventForm from "./EventForm"
import { getNextHourStart } from "@/lib/dateUtils"

const CALENDAR_VIEWS = [
  "dayGridMonth",
  "timeGridWeek",
  "timeGridDay",
  "listMonth"
] as const

type CalendarViewType = typeof CALENDAR_VIEWS[number]

const DEFAULT_VIEW_TYPE: CalendarViewType = "dayGridMonth"

export default function Calendar({events}: {events: EventWithParts[]}) {
  const [ selectedEvent, setSelectedEvent ] = useState<EventWithParts>()
  const [ selectedDate, setSelectedDate ] = useState<Date>()
  const [viewType, setViewType] = useState<CalendarViewType>();

  /* Load the calendar view type from localStorage if it exists */
  useEffect(() => {
    const savedViewType = JSON.parse(localStorage.getItem('calendar-view-type') || "null")
    const newViewType = CALENDAR_VIEWS.includes(savedViewType) ? savedViewType : DEFAULT_VIEW_TYPE
    setViewType(newViewType)
  },[])

  async function handleResizeOrDrop(eventChange: EventChangeArg) {
    const {id: combinedId, start, end} = eventChange.event
    if (!combinedId || start == null || end == null) {
      // ? Throw here or just log?
      alert("Event ID, start time, or end time is null during resize")
      console.error("Event ID, start time, or end time is null during resize")
      return
    }
    const partId = combinedId.split(EVENT_PART_ID_DELIMITER)[1]
    await updatePartTimes(partId, start, end)
  }

  function handleViewDidMount (view: ViewMountArg) {
    /*
      TODO Changing between 'week' and 'day' views doesn't fire 'viewDidMount'
      See issue: https://github.com/fullcalendar/fullcalendar/issues/5543
      Some people have used viewClassNames; not sure if that might work
      I'm going to leave it alone for now
    */
    localStorage.setItem(`calendar-view-type`, JSON.stringify(view.view.type))
  }

  async function handleEventClick(clickInfo: EventClickArg) {
    const [eventId] = clickInfo.event.id.split(EVENT_PART_ID_DELIMITER)
    setSelectedEvent(events.find(event => event.id === eventId))
  }

  /* Maybe inline this function */
  function handleDateClick(dateClick: DateClickArg) {
    setSelectedDate(getNextHourStart(dateClick.date, true))
  }


  if (!viewType) return null


  return (
    <>
      <FullCalendar
        plugins={[interaction, dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView={viewType}
        headerToolbar={{
          left: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          center: "title",
          right: "prev,next today"
        }}
        selectable={true}
        selectMirror={true}
        navLinks={true}
        editable={true}
        nowIndicator={true}
        views={{
          dayGridMonth: {
            type: "dayGridMonth",
            buttonText: "Month"
          },
          timeGridWeek: {
            type: "timeGridWeek",
            buttonText: "Week"
          },
          timeGridDay: {
            type: "timeGridDay",
            buttonText: "Day"
          },
          list: {
            type: "list",
            buttonText: "List"
          }
        }}
        events={displayEvents(events)}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventResize={handleResizeOrDrop}
        // eventDidMount={handleEventDidMount}
        eventDrop={handleResizeOrDrop}
        viewDidMount={handleViewDidMount}

        /* 
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
        */
      />
      {selectedEvent && (
        <Modal
          title="Update Event"
          isOpen={!!selectedEvent}
          onClose={() => {
            setSelectedEvent(undefined);
          }}
          headerDetails={<ConfirmDeleteDialog event={selectedEvent} onSuccess={() => setSelectedEvent(undefined)}/>}
        >
          <EventForm event={selectedEvent} onSuccess={() => {
            setSelectedEvent(undefined);
          }}/>
        </Modal>
      )}
      {selectedDate && (
        <Modal
          title="New Event"
          isOpen={!!selectedDate}
          onClose={() => {
            setSelectedDate(undefined)
          }}
        >
          <EventForm defaultDate={selectedDate} onSuccess={() => {setSelectedDate(undefined)}} />
        </Modal>
      )}
    </>
  );
}
