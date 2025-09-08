import { FaUser } from "react-icons/fa"
import { AppUser } from "../../../next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const UserAvatar = ({user}: {user?: AppUser | null}) => {
  return (
    <Avatar>
      <AvatarImage src={user?.image || ""}/>
      <AvatarFallback className="bg-blue-500">
        <FaUser/>
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar