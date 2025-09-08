"use client"

import { useRouter } from "next/navigation"
import { PropsWithChildren } from "react"

type LoginButtonProps = {
  mode?: "modal" | "redirect",
  asChild?: boolean,
}

// TODO accessibility? maybe 'asChild' helps with that?
const LoginButton = ({mode = "redirect", children, asChild}: PropsWithChildren<LoginButtonProps>) => {

  console.log(asChild)
  
  const router = useRouter()
  
  const onClick = () => {
    router.push("/auth/login")
  }

  if (mode === "modal") {
    return (
      <span>
        TODO: Implement Modal
      </span>
    )
  }

  return(
    <span className="cursor-pointer" onClick={onClick}>{children}</span>
  )
}

export default LoginButton