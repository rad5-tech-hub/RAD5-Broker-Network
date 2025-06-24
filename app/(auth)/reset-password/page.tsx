import ResetPassword from "@/components/forms/ResetPassword";
import React from "react";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading reset password form...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
