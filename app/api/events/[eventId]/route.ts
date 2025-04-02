// app/api/events/[eventId]/route.ts
import "server-only"; // Keep data fetching logic on the server
import { findEventById } from "@/lib/data-utils"; // Use the original (non .server) version here is fine
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Need cookies to check auth
import { jwtVerify } from "jose"; // Need JWT verification

// Reuse JWT constants
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
);
const COOKIE_NAME = "session";

// Helper function to verify JWT
async function verifyAuthentication(request: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);
    if (!tokenCookie) return false;

    await jwtVerify(tokenCookie.value, JWT_SECRET);
    return true; // Token exists and is valid
  } catch {
    return false; // Token is invalid or expired
  }
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  // Skip auth check for public event data
  // const isAuthenticated = await verifyAuthentication(request);
  // if (!isAuthenticated) {
  //   return NextResponse.json(
  //     { success: false, message: "Authentication required." },
  //     { status: 401 }
  //   );
  // }

  if (!eventId) {
    return NextResponse.json(
      { success: false, message: "Event ID is required." },
      { status: 400 }
    );
  }

  try {
    const event = await findEventById(eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    // Return the full event data including seats
    return NextResponse.json({ success: true, event: event });
  } catch (error) {
    console.error(`API Error fetching event ${eventId}:`, error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
