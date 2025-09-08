/* 
Takes a Date object and returns a Date object representing the start of the next hour 
Example: getNextHourStart(new Date("2023-10-01T12:30:00")) returns a Date object for "2023-10-01T13:00:00"
if useCurrentTime is true, it uses the current time of day to find the next hour on the passed day.
Example:  Given a current time of 17:23 on 2023-09-16, 
          getNextHourStart(new Date("2023-10-01T12:30:00"), true) 
          will return a Date object for "2023-10-01T18:00:00"
*/
export function getNextHourStart(date: Date, useCurrentTime?: boolean): Date {
  const nextHour = new Date(date);
  if (useCurrentTime) {
    nextHour.setHours(new Date().getHours() + 1); // Use current time of day to find next hour
  } else {
    nextHour.setHours(nextHour.getHours() + 1);   // Use time of day from the passed date to find next hour
  }
  nextHour.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to 0
  return nextHour;
}

/* Takes a Date object (start time) and a duration in minutes, returns the end time as a Date object */
export function getEndTime(startDateTime: Date, durationMinutes: number): Date {
  const endTime = new Date(startDateTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  return endTime;
} 

/* Takes two Date objects and returns the duration in minutes between two dates */
export function getDurationInMinutes(startDate: Date, endDate: Date): number {
  const diffInMs = endDate.getTime() - startDate.getTime();
  return Math.round(diffInMs / 60000); // 60000 ms in a minute
}

/* Takes a Date object and returns a string in the format of YYYY-MM-DD */
export function formatDate (date: Date): string {
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/* Takes a Date object and returns a string in the format of HH:mm */
export function formatTime (date: Date): string {
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/* Takes a Date object and returns a string in the format of YYYY-MM-DDTHH:MM */
export function formatDateTimeLocal (date: Date): string {
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/* Generates a Date object from a date string (YYYY-MM-DD) and a time string (HH:mm) */
export function generateDateObject(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}