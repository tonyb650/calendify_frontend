"use client";

import { updateUserSettingsAction } from "@/actions/users";
import { User } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { TbLogin2 } from "react-icons/tb";
import { FormGroup } from "./FormGroup";
import Modal from "./Modal";


export default function UserSettingsButton({user}: {user?: User}) {
  const { status, data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  // TODO need to work on the button styles & animations
  return (
    <>
      {status === "authenticated" && user ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`rounded-full bg-white p-0.5 cursor-pointer transition delay-50 duration-300 hover:bg-white/80 shadow-md hover:scale-105`}
        >
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        </button>
      ) : (
        <Link
          href="/api/auth/signin"
          className={`rounded-full bg-blue-600 p-1 cursor-pointer transition delay-50 duration-300 hover:bg-white/80 shadow-md hover:scale-105`}
        >
          <TbLogin2 className="w-8 h-8 text-white" />
        </Link>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-2xl font-bold"> {session?.user?.name}</h2>
          </div>

          <Link href="/api/auth/signout" className="btn">
            Sign Out
          </Link>
        </div>
        <UserSettingsForm onClose={onClose} initialSettings={{earliest: user?.earliest || null, latest: user?.latest || null}}/>
      </Modal>
    </>
  );
}

/* TIME_OPTIONS is for the dropdowns. Array of options that look like: { value: 0, label: "12:00 AM" } */
const TIME_OPTIONS = Array(48)
  .fill(null)
  .map((_, i) => {
    let hour = String(Math.floor(i / 2) % 12).padStart(2, "0");
    if (hour === "00") hour = "12"; // Convert 0 to 12 for AM/PM format
    const minute = i % 2 === 0 ? "00" : "30";
    return { value: i, label: `${hour}:${minute} ${i < 24 ? "AM" : "PM"}` };
  });

//! Fix "user" type here (only earliest & latest)
const UserSettingsForm = ({ initialSettings, onClose }: { initialSettings: Partial<User>, onClose: () => void }) => {
  const [earliest, setEarliest] = useState<number>(initialSettings.earliest || 16); // Default to 8:00 AM
  const [latest, setLatest] = useState<number>(initialSettings.latest || 36); // Default to 6:00 PM

  /* useActionState has three parameters
    1) our function that will be called by the returned formAction function
    2) the previous state of our 'response' (here is type of: UserActionResponse)
    3) optionally permalink
  */
  // (alias) function updateEventAction(prevState: UserActionResponse, formData: FormData): Promise<UserActionResponse>

  const [response, formAction, isPending] = useActionState(
    updateUserSettingsAction,
    {}
  );

  useEffect(() => {
    if (response.success) {
      onClose();
    }
  }, [response, onClose]);

  return (
    <form className="form" action={formAction}>
      <FormGroup>
        <label htmlFor="earliest">Earliest Start:</label>
        <select
          name="earliest"
          id="earliest"
          value={earliest}
          onChange={(e) => setEarliest(Number(e.target.value))}
        >
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormGroup>
      <FormGroup>
        <label htmlFor="latest">Latest End:</label>
        <select
          name="latest"
          id="latest"
          value={latest}
          onChange={(e) => setLatest(Number(e.target.value))}
        >
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormGroup>

      <button className="btn">{isPending ? "Updating..." : "Update"}</button>
    </form>
  );
};
