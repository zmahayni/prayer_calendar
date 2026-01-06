import { NextRequest, NextResponse } from "next/server";
import { fetchPrayerTimes } from "@/lib/aladhan";
import { generateICS } from "@/lib/ical";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const method = searchParams.get("method");

  // Validate required parameters
  if (!lat || !lng || !method) {
    return NextResponse.json(
      { error: "Missing required parameters: lat, lng, method" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const calculationMethod = parseInt(method);

  // Validate parameter values
  if (isNaN(latitude) || isNaN(longitude) || isNaN(calculationMethod)) {
    return NextResponse.json(
      { error: "Invalid parameter values" },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90) {
    return NextResponse.json(
      { error: "Latitude must be between -90 and 90" },
      { status: 400 }
    );
  }

  if (longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: "Longitude must be between -180 and 180" },
      { status: 400 }
    );
  }

  try {
    // Fetch prayer times for the next 30 days
    const prayerTimes = await fetchPrayerTimes(
      latitude,
      longitude,
      calculationMethod,
      30
    );

    // Generate iCal format
    const icsContent = generateICS(prayerTimes);

    // Return as .ics file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="prayer-times.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating prayer calendar:", error);
    return NextResponse.json(
      { error: "Failed to generate prayer calendar" },
      { status: 500 }
    );
  }
}
