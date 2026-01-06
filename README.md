# Prayer Times Calendar Sync

A lightweight web app that allows users to subscribe to daily Islamic prayer times directly in their calendar (Apple Calendar / Google Calendar) via an iCal (.ics) subscription link.

## Features

- 🕌 Daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
- 📅 Works with Apple Calendar, Google Calendar, and any calendar app that supports iCal subscriptions
- 🔄 Auto-updates without manual refresh
- 🌍 Location-based prayer times using latitude/longitude
- ⚙️ Multiple calculation methods supported
- 🚀 Stateless design - no user accounts needed

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Visit the website
2. Enter your location (use current location or manually enter latitude/longitude)
3. Select a prayer time calculation method
4. Click "Generate Calendar Link"
5. Copy the subscription URL and add it to your calendar app

#### For Apple Calendar:
1. Open Calendar app
2. Go to File → New Calendar Subscription
3. Paste the subscription URL
4. Click Subscribe

#### For Google Calendar:
1. Open Google Calendar
2. Click the + next to "Other calendars"
3. Select "From URL"
4. Paste the subscription URL
5. Click "Add calendar"

## API Endpoint

### GET `/api/prayer-calendar`

Query parameters:
- `lat` (required): Latitude (-90 to 90)
- `lng` (required): Longitude (-180 to 180)
- `method` (required): Calculation method (1-14, see below)

#### Calculation Methods

| ID | Method |
|----|--------|
| 1 | University of Islamic Sciences, Karachi |
| 2 | Islamic Society of North America (ISNA) |
| 3 | Muslim World League (MWL) |
| 4 | Umm Al-Qura University, Makkah |
| 5 | Egyptian General Authority of Survey |
| 7 | Institute of Geophysics, University of Tehran |
| 8 | Gulf Region |
| 9 | Kuwait |
| 10 | Qatar |
| 11 | Majlis Ugama Islam Singapura, Singapore |
| 12 | Union Organization islamic de France |
| 13 | Diyanet İşleri Başkanlığı, Turkey |
| 14 | Spiritual Administration of Muslims of Russia |

Example:
```
https://your-domain.com/api/prayer-calendar?lat=40.7128&lng=-74.0060&method=2
```

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Next.js API routes
- **Styling**: Tailwind CSS
- **Prayer Times API**: [AlAdhan API](https://aladhan.com/prayer-times-api)
- **Deployment**: Vercel (recommended)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/prayer-calendar)

Or manually:

```bash
npm run build
vercel deploy
```

## License

MIT
