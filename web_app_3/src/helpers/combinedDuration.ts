import { EventWithParts } from "@/db/events";

export default function combinedDuration(parts?: EventWithParts["parts"]): number | undefined {
  if (!parts || parts.length === 0) {
    return undefined;
  }

  let totalDuration = 0;

  for (const part of parts) {
    const duration = part.end.getTime() - part.start.getTime();
    totalDuration += duration;
  }

  return totalDuration / (1000 * 60)
}