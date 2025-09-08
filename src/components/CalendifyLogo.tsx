import React from "react";
import { RiCalendarScheduleLine } from "react-icons/ri";

const CalendifyLogo = () => {
  return (
    <div className="flex items-center gap-x-2 bg-white/10 px-3 py-1 rounded-lg shadow-sm cursor-default">
      <RiCalendarScheduleLine className="w-8 h-8" />
      <span className="text-3xl font-semibold ">Calendify</span>
    </div>
  );
};

export default CalendifyLogo;
