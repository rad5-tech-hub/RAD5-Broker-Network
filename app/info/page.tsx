"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");

  const handleProceed = () => {
    if (agentId) {
      router.push(`/register/agent/${agentId}`);
    } else {
      router.push("/register/agent/chibuike-christian-9490-118564e1"); // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="relative">
            <Image
              src="/rad5hub.png"
              alt="RAD5 Tech Hub Logo"
              width={150}
              height={150}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-white dark:border-gray-700"
            />
            <CardTitle className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mt-16">
              Welcome to RAD5 Tech Hub Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              RAD5 Tech Hub offers cutting-edge tech programs designed to
              empower you with skills in today’s digital world. Whether you’re
              interested in <strong>Frontend Web Development</strong>,{" "}
              <strong>Data Analytics</strong>, <strong>UI/UX Design</strong>,{" "}
              <strong>Digital Marketing</strong>,{" "}
              <strong>Social Media Management</strong>, or more, our courses are
              tailored to help you succeed. Each program varies in duration (2-6
              months) and provides hands-on training with a 5% commission
              opportunity for referrals through the RAD5 Brokers Network.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Frontend Web Development</strong>: 6 months - Build
                responsive websites.
              </li>
              <li>
                <strong>Data Analytics</strong>: 4 months - Master data
                insights.
              </li>
              <li>
                <strong>UI/UX Design</strong>: 4 months - Create user-friendly
                designs.
              </li>
              <li>
                <strong>Digital Marketing</strong>: 4 months - Boost online
                presence.
              </li>
              <li>
                <strong>Social Media Management</strong>: 2 months - Manage
                social platforms.
              </li>
            </ul>
            <p className="text-center">
              For more details or to explore our full range of programs, visit
              our official website:{" "}
              <a
                href="https://rad5.com.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://rad5.com.ng/
              </a>
            </p>
            <div className="text-center">
              <Button
                onClick={handleProceed}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mt-6 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                OK, Proceed to Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// export const metadata = {
//   title: "RAD5 Tech Hub Programs | Join Now",
//   description:
//     "Discover cutting-edge tech programs at RAD5 Tech Hub, including Frontend Web Development, Data Analytics, and more. Earn 5% commission through the RAD5 Brokers Network.",
//   openGraph: {
//     title: "RAD5 Tech Hub Programs | Join Now",
//     description:
//       "Discover cutting-edge tech programs at RAD5 Tech Hub, including Frontend Web Development, Data Analytics, and more. Earn 5% commission through the RAD5 Brokers Network.",
//     url: "https://rad-5-broker-network.vercel.app/",
//     siteName: "RAD5 Brokers Network",
//     images: [
//       {
//         url: "https://rad-5-broker-network.vercel.app/rad5hub.png", // Replace with your actual image URL
//         width: 800,
//         height: 600,
//         alt: "RAD5 Tech Hub Programs",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "RAD5 Tech Hub Programs | Join Now",
//     description:
//       "Discover cutting-edge tech programs at RAD5 Tech Hub, including Frontend Web Development, Data Analytics, and more. Earn 5% commission through the RAD5 Brokers Network.",
//     images: ["https://rad-5-broker-network.vercel.app/rad5hub.png"], // Replace with your actual image URL
//   },
// };
