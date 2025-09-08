'use client'

import AuthProvider from "@/app/_auth/Provider"
import { User } from "@/generated/prisma"
import { RiCalendarScheduleLine } from "react-icons/ri"
import AddEventButton from "./AddEventButton"
import UserSettingsButton from "./UserSettingsButton"

const Navbar = ({user}: {user?: User}) => {
  return (
    <div className="bg-blue-600 text-white shadow-md sticky top-0 z-10">
      <nav className="flex justify-between items-center mb-5 px-5 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-x-2 bg-white/10 px-3 py-1 rounded-lg shadow-sm cursor-default">
          <RiCalendarScheduleLine className="w-8 h-8" />
          <span className="text-3xl font-semibold ">Calendify</span>
        </div>
        <div className="flex items-center gap-x-3">
          <AddEventButton/>
          <AuthProvider>
            <UserSettingsButton user={user}/>
          </AuthProvider>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
