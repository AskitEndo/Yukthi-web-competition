// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "session";

export async function POST() {
  try {
    // Clear the session cookie
    cookies().delete(COOKIE_NAME);
    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

// Optional: Could also use GET if preferred for logout link/button simplicity
// export async function GET() { ... same logic ... }
