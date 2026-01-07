import { DailyPrayerTimes } from "./aladhan";

function formatDateInUTC(dateStr: string, time: string, timezone: string): string {
  // Parse date (YYYY-MM-DD) and time (HH:MM)
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = time.split(':');

  // Create a localized date string
  const localDateStr = `${year}-${month}-${day}T${hours}:${minutes}:00`;

  // Parse the date as if it's in the given timezone
  // We'll use toLocaleString to get the UTC equivalent
  const date = new Date(localDateStr);

  // Get the date in the specified timezone
  const tzDateStr = date.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Parse back to get the offset
  const tzDate = new Date(tzDateStr);
  const offset = date.getTime() - tzDate.getTime();

  // Create the actual UTC date by parsing the local time string and adding offset
  const actualDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
  const utcDate = new Date(actualDate.getTime() + offset);

  // Format as YYYYMMDDTHHmmSSZ
  const y = utcDate.getUTCFullYear();
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utcDate.getUTCDate()).padStart(2, '0');
  const h = String(utcDate.getUTCHours()).padStart(2, '0');
  const min = String(utcDate.getUTCMinutes()).padStart(2, '0');
  const sec = String(utcDate.getUTCSeconds()).padStart(2, '0');

  return `${y}${m}${d}T${h}${min}${sec}Z`;
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
      const dtstart = formatDateInUTC(date, prayerTime, timezone);
      const uid = generateUID(date, prayerName);

      ics.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${dtstart}`,
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
