"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoaderProps {
  type: "earnings" | "withdrawals";
}

export default function Loader({ type }: LoaderProps) {
  return (
    <div className="animate-fade-in transition-opacity duration-300">
      <div className="flex justify-center mb-6">
        <div className="h-8 w-8 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin animate-pulse" />
      </div>
      <div className="space-y-6">
        {type === "earnings" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-40 mt-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-full mt-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {type === "withdrawals" && (
          <>
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-40 mt-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-40 mt-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
