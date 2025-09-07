import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  title?: string,
  isOpen: boolean, 
  onClose: () => void, 
  children: ReactNode,
  headerDetails?: ReactNode,
}

export default function Modal({title, isOpen, onClose, headerDetails, children}: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/30">
        <DialogPanel className="max-w-xl min-w-96 bg-white rounded-lg p-3 shadow-lg">
          <div className="flex justify-end ">
            <button
              onClick={onClose}
              className="transition delay-50 duration-300 hover:rotate-90 hover:text-red-800"
              >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 pb-4 ">
            <DialogTitle className="text-2xl font-bold flex justify-between gap-4 mb-3">{title || ""}{headerDetails}</DialogTitle>
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}