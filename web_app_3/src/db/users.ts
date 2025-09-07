import { getServerSession } from "next-auth";
import delay from "./delay";
import prisma from "../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/generated/prisma";

type UpdateUser = Partial<User>;

// // ! Do this next !!!!!!!
// export async function getUserPreferences(): Promise<{
//   earliest: number;
//   latest: number;
// }> {
//   // TODO This is to simulate fetching user preferences from a database or API

//   const earliest = 16;
//   const latest = 40;

//   return { earliest, latest };
// }


export async function getCurrentUser(): Promise<User | null> {
  await delay(3000);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null
  }

  return prisma.user.findFirst({
    where: {
      id: session.user.id
    }
  })
}

export async function updateUser({
  earliest,
  latest
}: UpdateUser): Promise<User> {
  await delay(500);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  console.log("UPDATING USER IN SERVICE")
  console.log(earliest, latest)
  const updatedUser = prisma.user.update({
    where: { id: session.user.id },
    data: {
      earliest,
      latest
    }
  })
  return updatedUser
  // return prisma.user.update({
  //   where: { id: session.user.id },
  //   data: {
  //     earliest,
  //     latest
  //   }
  // })
}
