import { DailyPrayerTimes } from "./aladhan";

function formatDate(dateStr: string, time: string): string {
  // Parse date (YYYY-MM-DD) and time (HH:MM)
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = time.split(':');

  // Create UTC date string in iCal format: YYYYMMDDTHHmmSSZ
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );

  // Format as YYYYMMDDTHHMMSS
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

export function generateICS(prayerTimesData: DailyPrayerTimes[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prayer Times Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Prayer Times',
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:Daily Islamic Prayer Times',
  ];

  prayerTimesData.forEach(({ date, prayers }) => {
    Object.entries(prayers).forEach(([prayerName, prayerTime]) => {
      const dtstart = formatDate(date, prayerTime);
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
