import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prayer Times Calendar",
  description: "Subscribe to daily Islamic prayer times in your calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
