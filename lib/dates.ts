import { addDays, addWeeks, format, getDay, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

/** Returns the next `count` upcoming Tuesdays (today inclusive if today is Tuesday). */
export function nextTuesdays(count: number, from: Date = new Date()): Date[] {
  const dates: Date[] = [];
  let cursor = startOfDay(from);

  // Advance to the next Tuesday (day 2)
  const dayOfWeek = getDay(cursor);
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;
  cursor = addDays(cursor, daysUntilTuesday === 0 ? 0 : daysUntilTuesday);

  for (let i = 0; i < count; i++) {
    const d = new Date(cursor);
    d.setHours(19, 0, 0, 0);
    dates.push(d);
    cursor = addWeeks(cursor, 1);
  }

  return dates;
}

/** Format a date as "Martes, 19 de mayo de 2026" */
export function formatSlotDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

/** Format short: "Mar 19 may" */
export function formatSlotDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, "d MMM yyyy");
}
