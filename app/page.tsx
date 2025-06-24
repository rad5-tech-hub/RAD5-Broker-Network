import { Suspense } from "react";
import LandingPageClient from "@/components/LandingPageClient";

export const metadata = {
  title: "RAD-5 Brokers Network - Earn with Elite Tech Programs",
  description:
    "Join RAD-5 Brokers Network as an ambassador to refer students to top-tier tech programs and earn up to 5% commission instantly.",
  keywords: "broker network, RAD-5, tech programs, earn commission, ambassador",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "RAD-5 Brokers Network - Earn with Elite Tech Programs",
    description:
      "Join RAD-5 Brokers Network as an ambassador to refer students to top-tier tech programs and earn up to 5% commission instantly.",
    url: "https://rad-5-broker-network.vercel.app",
    siteName: "RAD-5 Brokers Network",
    images: [
      {
        url: "https://rad-5-broker-network.vercel.app/rad5hub.png",
        width: 1200,
        height: 630,
        alt: "RAD-5 Brokers Network Logo",
      },
    ],
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#ffff]/20 dark:bg-gray-900">
            <div className="relative w-full max-w-4xl px-4">
              {/* Skeleton Screen */}
              <div className="flex flex-col items-center space-y-8 animate-pulse">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="w-3/4 h-12 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-300 dark:bg-gray-700 rounded"
                    />
                  ))}
                </div>
              </div>
              {/* Branded Animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  className="animate-spin-slow"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                  <image
                    href="/rad5hub.png"
                    x="25"
                    y="25"
                    width="50"
                    height="50"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        }
      >
        <LandingPageClient />
      </Suspense>
    </main>
  );
}
