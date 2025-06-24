import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Load Poppins font with specified weights and subsets
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Define metadata for the entire app
export const metadata: Metadata = {
  title: "RAD-5 Brokers Network",
  description:
    "Join RAD-5 Brokers Network to earn commissions by referring students to elite tech programs.",
  keywords: "broker network, RAD-5, tech programs, earn commission, ambassador",
  icons: {
    icon: "/rad5hub.png", // Ensure this image is in the public folder
  },
  openGraph: {
    title: "RAD-5 Brokers Network",
    description:
      "Join RAD-5 Brokers Network to earn commissions by referring students to elite tech programs.",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} min-h-screen bg-[#ffff]/20 dark:bg-gray-900`}
      >
        <Toaster position="top-right" richColors duration={3000} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
