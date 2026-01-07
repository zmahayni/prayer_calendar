import { DailyPrayerTimes } from "./aladhan";

function formatDateWithTimezone(dateStr: string, time: string, timezone: string): string {
  // Parse date (YYYY-MM-DD) and time (HH:MM)
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = time.split(':');

  // Format as YYYYMMDDTHHMMSS (local time, not UTC)
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function addMinutes(dateStr: string, time: string, minutesToAdd: number): string {
  // Parse date (YYYY-MM-DD) and time (HH:MM)
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = time.split(':');

  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );

  date.setMinutes(date.getMinutes() + minutesToAdd);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${y}${m}${d}T${h}${min}00`;
}

function generateUID(date: string, prayer: string): string {
  return `${date}-${prayer}@prayer-calendar`;
}

export function generateICS(prayerTimesData: DailyPrayerTimes[], timezone: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prayer Times Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Prayer Times',
    `X-WR-TIMEZONE:${timezone}`,
    'X-WR-CALDESC:Daily Islamic Prayer Times',
  ];

  prayerTimesData.forEach(({ date, prayers }) => {
    Object.entries(prayers).forEach(([prayerName, prayerTime]) => {
      const dtstart = formatDateWithTimezone(date, prayerTime, timezone);
      const dtend = addMinutes(date, prayerTime, 5); // 5 minute duration
      const uid = generateUID(date, prayerName);

      ics.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;TZID=${timezone}:${dtstart}`,
        `DTEND;TZID=${timezone}:${dtend}`,
        `SUMMARY:${prayerName}`,
        `DESCRIPTION:${prayerName} prayer time`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT'
      );
    });
  });

  ics.push('END:VCALENDAR');

  return ics.join('\r\n');
}
