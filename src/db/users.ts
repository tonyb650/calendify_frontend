import { User } from "@/generated/prisma";
import prisma from "../../lib/prisma";
import delay from "./delay";
import { currentUser } from "./auth";

type UpdateUser = Partial<User>;

export async function updateUser({
  earliest,
  latest
}: UpdateUser): Promise<User> {
  await delay(500);
  
  const user = await currentUser()
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const updatedUser = prisma.user.update({
    where: { id: user.id},
    data: {
      earliest,
      latest
    }
  })
  return updatedUser
}



export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({where:{email}})
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    const user = await prisma.user.findUnique({where:{id}})
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}