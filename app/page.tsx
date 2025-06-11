import { Suspense } from "react";
import LandingPage from "@/components/Landing"; // Adjust path if needed

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage />
    </Suspense>
  );
}
