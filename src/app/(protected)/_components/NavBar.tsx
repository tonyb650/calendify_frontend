'use client'

import CalendifyLogo from "@/components/CalendifyLogo"
import AddEventButton from "../calendar/_components/AddEventButton"
import UserButton from "@/components/user/UserButton"

const Navbar = () => {
  return (
    <div className="bg-blue-600 text-white shadow-md sticky top-0 z-10">
      <nav className="flex justify-between items-center mb-5 px-5 py-3 max-w-7xl mx-auto">
        <CalendifyLogo/>
        <div className="flex items-center gap-x-3">
          <AddEventButton/>
          <UserButton/>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
