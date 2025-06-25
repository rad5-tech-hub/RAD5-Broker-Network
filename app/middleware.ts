import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simulate a function to check referral ID validity (replace with your logic)
async function isValidReferralId(referralId: string): Promise<boolean> {
  // Example: Fetch from an API or database
  const response = await fetch(
    `https://rbn.bookbank.com.ng/api/v1/referrals/${referralId}`
  );
  const data = await response.json();
  return response.ok && data.valid; // Adjust based on your API response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route matches /register/agent/[id]
  if (pathname.startsWith("/register/agent/")) {
    const referralId = pathname.split("/").pop(); // Extract the [id] part

    if (!referralId) {
      return NextResponse.redirect(new URL("/register", request.url)); // Redirect to general register if no ID
    }

    // Check authentication (example using a token from cookies or headers)
    const token = request.cookies.get("rbn_auth_token")?.value; // Adjust token name
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Validate referral ID
    const isValid = await isValidReferralId(referralId);
    if (!isValid) {
      return NextResponse.redirect(
        new URL("/register?invalidReferral=true", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register/agent/:id*"], // Matches /register/agent/[id] and subpaths
};
