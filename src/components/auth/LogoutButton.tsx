import { PropsWithChildren } from "react"
import { logout } from "@/actions/logout"

const LogoutButton = ({ children }: PropsWithChildren) => {
  const onClick = () => {
    logout()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}

export default LogoutButton
