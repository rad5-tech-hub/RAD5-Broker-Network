"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WithdrawalForm() {
  const [amount, setAmount] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountDetails) {
      toast.error("Error", {
        description: "Please fill in all fields.",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Error", {
        description: "Please enter a valid positive amount.",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const confirmWithdrawal = () => {
    setTimeout(() => {
      toast.success("Success", {
        description: "Withdrawal request submitted successfully!",
      });
      setAmount("");
      setAccountDetails("");
      setIsModalOpen(false);
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="accountDetails">Account Details</Label>
              <Input
                id="accountDetails"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder="Bank account or payment method"
              />
            </div>
            <Button type="submit">Submit Request</Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to request a withdrawal of $
            {parseFloat(amount).toFixed(2)} to {accountDetails}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmWithdrawal}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
