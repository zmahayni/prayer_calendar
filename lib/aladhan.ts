export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DailyPrayerTimes {
  date: string;
  prayers: PrayerTimes;
}

export interface PrayerTimesResponse {
  prayerTimes: DailyPrayerTimes[];
  timezone: string;
}

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  days: number = 30
): Promise<PrayerTimesResponse> {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  // Fetch current month
  const url1 = `https://api.aladhan.com/v1/calendar/${currentYear}/${currentMonth}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const response1 = await fetch(url1);
  if (!response1.ok) {
    throw new Error(`Failed to fetch prayer times for ${currentMonth}/${currentYear}`);
  }
  const data1 = await response1.json();

  // Fetch next month to ensure we have 30 days
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const url2 = `https://api.aladhan.com/v1/calendar/${nextYear}/${nextMonth}?latitude=${lat}&longitude=${lng}&method=${method}`;
  const response2 = await fetch(url2);
  if (!response2.ok) {
    throw new Error(`Failed to fetch prayer times for ${nextMonth}/${nextYear}`);
  }
  const data2 = await response2.json();

  // Get timezone from the first response
  const timezone = data1.data[0]?.meta?.timezone || 'UTC';

  // Combine both months
  const allDays = [...data1.data, ...data2.data];

  // Filter to get only the next 30 days starting from today
  const prayerTimes: DailyPrayerTimes[] = [];
  const todayTimestamp = today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days && i < allDays.length; i++) {
    const dayData = allDays.find((d: any) => {
      const dayDate = new Date(d.date.gregorian.date.split('-').reverse().join('-'));
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      return dayDate.toDateString() === targetDate.toDateString();
    });

    if (!dayData) continue;

    const timings = dayData.timings;
    const cleanTime = (time: string) => time.split(' ')[0]; // Remove timezone suffix

    const dateStr = dayData.date.gregorian.date.split('-').reverse().join('-'); // Convert DD-MM-YYYY to YYYY-MM-DD

    prayerTimes.push({
      date: dateStr,
      prayers: {
        Fajr: cleanTime(timings.Fajr),
        Dhuhr: cleanTime(timings.Dhuhr),
        Asr: cleanTime(timings.Asr),
        Maghrib: cleanTime(timings.Maghrib),
        Isha: cleanTime(timings.Isha),
      },
    });
  }

  return { prayerTimes, timezone };
}

export const CALCULATION_METHODS = {
  1: "University of Islamic Sciences, Karachi",
  2: "Islamic Society of North America",
  3: "Muslim World League",
  4: "Umm Al-Qura University, Makkah",
  5: "Egyptian General Authority of Survey",
  7: "Institute of Geophysics, University of Tehran",
  8: "Gulf Region",
  9: "Kuwait",
  10: "Qatar",
  11: "Majlis Ugama Islam Singapura, Singapore",
  12: "Union Organization islamic de France",
  13: "Diyanet İşleri Başkanlığı, Turkey",
  14: "Spiritual Administration of Muslims of Russia",
};
