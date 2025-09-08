import { deleteEventAction } from "@/actions/events";
import { Event } from "@/generated/prisma";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useActionState, useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

// TODO Improve styling!

export function ConfirmDeleteDialog({event, onSuccess}: {event: Event, onSuccess: () => void}) {
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [response, formAction, isPending] = useActionState( deleteEventAction, {data: event}); 

  useEffect(() => {
    if (response.success) {
      onSuccess()
    }
  },[response, onSuccess])

  return (
    <>
      <button
        onClick={() => setConfirmIsOpen(true)}
        className="rounded-full bg-white text-blue-700"
      >
        <RiDeleteBin5Line className="text-blue-800" />
      </button>
      <Dialog open={confirmIsOpen} onClose={() => {setConfirmIsOpen(false)}} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/30">
          <DialogPanel className="max-w-xl bg-white rounded-lg p-10 shadow-lg space-y-2">
            <DialogTitle className="text-2xl font-bold flex justify-between gap-4">
              Delete Event
            </DialogTitle>
            <p>Are you sure you want to delete this event:</p>
            <p className="text-sm font-semibold">{event.title}</p>
            <form action={formAction} className="flex justify-end gap-4">
              <button type="button" className="btn" onClick={() => setConfirmIsOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn">
                {isPending ? "Deleting...": "Confirm"}
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
