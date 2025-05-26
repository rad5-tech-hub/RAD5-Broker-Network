"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data
const earnings = {
  total: 185,
  byCourse: [
    { course: "Web Development", amount: 50 },
    { course: "Data Analytics", amount: 75 },
    { course: "UI/UX Design", amount: 60 },
  ],
};

export default function EarningsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Total Earnings: ${earnings.total}
          </h3>
        </div>
        <div className="space-y-2">
          {earnings.byCourse.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.course}</span>
              <span>${item.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
