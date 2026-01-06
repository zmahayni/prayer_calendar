"use client";

import { useState } from "react";
import { CALCULATION_METHODS } from "@/lib/aladhan";

export default function Home() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [method, setMethod] = useState("2");
  const [subscriptionUrl, setSubscriptionUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter it manually.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid latitude and longitude");
      return;
    }

    if (lat < -90 || lat > 90) {
      alert("Latitude must be between -90 and 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/api/prayer-calendar?lat=${lat}&lng=${lng}&method=${method}`;
    setSubscriptionUrl(url);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(subscriptionUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Prayer Times Calendar
          </h1>
          <p className="text-gray-600">
            Subscribe to daily Islamic prayer times directly in your calendar
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleGenerateLink}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loading}
                className="mb-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Getting location..." : "Use My Current Location"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CALCULATION_METHODS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium transition-colors"
            >
              Generate Calendar Link
            </button>
          </form>
        </div>

        {subscriptionUrl && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Calendar Subscription Link
            </h2>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subscriptionUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  For Apple Calendar:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open Calendar app</li>
                  <li>Go to File → New Calendar Subscription</li>
                  <li>Paste the link above</li>
                  <li>Click Subscribe</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  For Google Calendar:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open Google Calendar</li>
                  <li>Click the + next to "Other calendars"</li>
                  <li>Select "From URL"</li>
                  <li>Paste the link above</li>
                  <li>Click "Add calendar"</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your calendar will automatically update
                  with fresh prayer times. No manual refresh needed!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
