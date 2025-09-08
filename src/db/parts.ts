import prisma from "../../lib/prisma";
import delay from "./delay";


type CreatePartValues = {
  eventId: string;
  start: Date;
  end: Date;
}

export async function createPart({eventId, start, end}: CreatePartValues) {
  const result = await prisma.part.create({
    data: {
      start,
      end,
      event: {
        connect: { id: eventId }
      }
    }
  })
  return result
}

export async function updatePart({partId, start, end}: {partId: string; start: Date; end: Date}) {
  delay(2000)
  const result = await prisma.part.update({
    where: { id: partId },
    data: { start, end }
  })
  return result
}

export async function deletePart(partId: string) {
  const result = await prisma.part.delete({
    where: { id: partId }
  })
  return result
}