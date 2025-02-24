import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strava Activities Heatmap | App",
  description:
    "Display your strava activities into a calendar heatmap and showcase your progression with ease!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen flex flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
