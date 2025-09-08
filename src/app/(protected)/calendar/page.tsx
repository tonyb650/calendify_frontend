import { getEvents } from "@/db/events";
import { Suspense } from "react";
import CalendarView from "./_components/Calendar";

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
