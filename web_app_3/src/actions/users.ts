"use server"

import { updateUser } from "@/db/users";
import type { User } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type FormError = {earliest?: string[], latest?: string[]}

export type UserActionResponse = {
  success?: boolean
  error?: FormError
  data?: User
}

const updateUserSettingsSchema = z.object({
  earliest: z.number().max(48, "Events longer than one week are not currently supported").optional(),
  latest: z.number().max(48, "Events longer than one week are not currently supported").optional(),
}).refine((data) => {
  if (data.earliest !== undefined && data.latest !== undefined) {
    return data.latest > data.earliest;
  }
  return true;
}, {
  message: "Latest time must be greater than earliest time",
  path: ["latest"]
})


/*****************************************/
/****** UPDATE User Settings Action ******/
/*****************************************/
export async function updateUserSettingsAction(prevState: UserActionResponse, formData: FormData): Promise<UserActionResponse> {
  const {success, data, error} = updateUserSettingsSchema.safeParse({
    earliest: Number(formData.get("earliest")),
    latest: Number(formData.get("latest")),
  })
    
  if (!success) {
    console.error(error?.flatten().fieldErrors)
    return {error: error?.flatten().fieldErrors}
  }
  
  const user: User = await updateUser({
    earliest: data.earliest,
    latest: data.latest,
  })

  if (!user) {
    throw new Error("User not found or could not be updated");
  }

  revalidatePath('/')
  return {success: true}
}