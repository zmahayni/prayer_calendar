Project: Prayer Times Calendar Sync
Summary

A lightweight web app that allows users to subscribe to daily Islamic prayer times directly in their calendar (Apple Calendar / Google Calendar) via an iCal (.ics) subscription link.
The goal is to surface prayer times where users already plan their day, without building a full mobile app or notification system.

The app is stateless, requires no user accounts, and auto-updates prayer times via calendar polling.

Core User Flow

User visits the site

User inputs:

City or latitude/longitude

Prayer time calculation method

App generates a calendar subscription URL

User adds the URL to their calendar once

Prayer times appear daily and auto-update

Tech Stack

Frontend: Next.js (App Router)

Backend: Next.js API routes

Hosting: Vercel

Calendar Format: iCal / .ics

Prayer Time API: AlAdhan API

External API
AlAdhan Prayer Times API

Used to fetch daily prayer times based on location and calculation method.

Inputs:

latitude

longitude

date range

calculation method

Outputs:

Fajr, Dhuhr, Asr, Maghrib, Isha times

Backend Structure
API Route
GET /api/prayer-calendar.ics


Query params:

lat

lng

method

(optional) timezone

Behavior:

Fetch prayer times for today → next 30 days

Generate calendar events for each prayer

Return a valid .ics file

No database, no caching layer

This endpoint is used as a calendar subscription URL.

Calendar Behavior

Calendar apps periodically poll the .ics URL

Each request regenerates fresh prayer times

No manual refresh required by the user

Works with Apple Calendar and Google Calendar

Frontend Pages
/

Simple form:

City (or lat/lng)

Calculation method dropdown

Button: “Generate Calendar Link”

Displays:

Subscription URL

Instructions for adding to calendar

Scope Constraints (Intentional)

Out of scope:

User accounts

Notifications / adhan audio

Mobile app

Database

Custom fiqh edge cases

Focus is on:

Reliability

Simplicity

Clean integration

Future Enhancements (Optional)

Toggle specific prayers

Event duration customization

Widgets / native apps

Shortened subscription URLs

Multiple calculation presets

Success Criteria

User adds calendar link once

Prayer times appear correctly every day

Calendar auto-updates without user action

App remains simple, fast, and maintainable