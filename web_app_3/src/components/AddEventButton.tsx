"use client"

import { useState } from "react"
import { RiAddLine } from "react-icons/ri"
import EventForm from "./EventForm"
import Modal from "./Modal"

export default function AddEventButton() {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-white text-blue-700 p-2 cursor-pointer"
      >
        <RiAddLine className="w-5 h-5 transition delay-50 duration-300 hover:rotate-90" />
      </button>
      <Modal title="New Event" isOpen={isOpen} onClose={onClose}>
        <EventForm defaultDate={new Date()} onSuccess={onClose} />
      </Modal>
    </>
  );
}
