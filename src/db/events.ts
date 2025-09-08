"use server";

import { auth } from "@/auth";
// import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import delay from "./delay";
import type { Event, Prisma } from "@/generated/prisma";

type CreateEvent = Partial<Event> & Required<Pick<Event, "title">>;
type UpdateEvent = Partial<Event> & Required<Pick<Event, "id">>;
export type EventWithParts = Prisma.EventGetPayload<{include: { parts: true } }>;

export async function getEvents(): Promise<EventWithParts[]> {
  await delay(500);
  
  const session = await auth()
  // const session = null//await getServerSession(authOptions)

  if (!session?.user?.id) {
    return []
  }

  return prisma.event.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      parts: true
    }
  });
}


export async function createEvent({
  title,
  isAppointment,
  isBreakable
}: CreateEvent): Promise<EventWithParts> {
  await delay(500);

  const session = await auth()
  // const session = null//await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const event = await prisma.event.create({
    data: {
      userId: session?.user?.id,
      title,
      isAppointment,
      isBreakable
    },
    include: {
      parts: true
    }
  });
  return event
}


export async function updateEvent({
  id,
  title,
  isAppointment,
  isBreakable
}: UpdateEvent): Promise<EventWithParts> {
  await delay(500);
    
  const session = await auth()
  // const session = null//await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.event.update({
    where: { id: id, userId: session.user.id},
    data: {
      title,
      isAppointment,
      isBreakable, 
    },
    include: {
      parts: true
    }
  })
}


export async function deleteEvent(id: string) {
  await delay(500);
    
  const session = await auth()
  // const session = null//await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  
  await prisma.event.delete({
    where: {
      id: id,
      userId: session.user.id
    }
  });
}
