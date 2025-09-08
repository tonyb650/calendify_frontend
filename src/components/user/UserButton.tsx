"use client"

import LogoutButton from "@/components/auth/LogoutButton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useCurrentUser from "@/hooks/useCurrentUser"
import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { FaGear } from "react-icons/fa6"
import UserAvatar from "./UserAvatar"
import UserSettingsModal from "./UserSettingsModal"
import UserSettingsForm from "./UserSettingsForm"


// ! Watch this video to figure out Dialog within Dropdown
// https://www.youtube.com/watch?v=JwNf4ujqsFU

const UserButton = () => {
  const user = useCurrentUser()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <UserSettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen}>
        <UserSettingsForm onClose={() => setIsSettingsOpen(false)} /> 
      </UserSettingsModal>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 t" align="end">
          <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
            <FaGear className="h-4 w-4 mr-2"/>
            Settings
          </DropdownMenuItem>
          <LogoutButton>
            <DropdownMenuItem>
              <FaSignOutAlt className="h-4 w-4 mr-2"/>
              Sign Out
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserButton