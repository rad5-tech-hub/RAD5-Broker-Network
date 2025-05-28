"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data
const referrals = [
  {
    id: 1,
    name: "John Doe",
    course: "Web Development",
    date: "2025-05-01",
    commission: 50,
  },
  {
    id: 2,
    name: "Jane Smith",
    course: "Data Analytics",
    date: "2025-05-03",
    commission: 75,
  },
  {
    id: 3,
    name: "Alice Johnson",
    course: "UI/UX Design",
    date: "2025-05-10",
    commission: 60,
  },
];

export default function ReferralsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referred Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Commission (₦)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.name}</TableCell>
                <TableCell>{referral.course}</TableCell>
                <TableCell>{referral.date}</TableCell>
                <TableCell>{referral.commission}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
