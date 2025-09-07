import CalendarView from "@/components/Calendar";
import { getEvents } from "@/db/events";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <CalendarPage />
    </Suspense>
  );
}

async function CalendarPage() {
  const events = await getEvents()

  return <CalendarView events={events} />;
}
