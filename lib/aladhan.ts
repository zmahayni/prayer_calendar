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

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  days: number = 30
): Promise<DailyPrayerTimes[]> {
  const results: DailyPrayerTimes[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=${method}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch prayer times for ${day}-${month}-${year}`);
    }

    const data = await response.json();
    const timings = data.data.timings;

    results.push({
      date: `${year}-${month}-${day}`,
      prayers: {
        Fajr: timings.Fajr,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
      },
    });
  }

  return results;
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
