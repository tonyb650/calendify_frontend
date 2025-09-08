'use server'

import { RegisterSchema } from "@/schemas"
import z from "zod"
import bcryptjs from 'bcryptjs'
import { getUserByEmail } from "@/db/users"
import prisma from "../../lib/prisma"


export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!"}
  }

  const {email, password, name, earliest, latest} = validatedFields.data

  const hashedPassword = await bcryptjs.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {error: "Email already in use!"}
  }

  await prisma.user.create({
    data: {
      email, name, password: hashedPassword, earliest, latest
    }
  })

  // TODO: send verification token email
  
  return { success: "User Created!"}
}