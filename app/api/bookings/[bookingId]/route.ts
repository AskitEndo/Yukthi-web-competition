// app/api/bookings/[bookingId]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { findBookingById, findEventById } from "@/lib/data-utils"; // Use existing utils
import { Booking, Event } from "@/lib/types";

// Reuse JWT constants
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
);
const COOKIE_NAME = "session";

// Helper to get authenticated user ID (can be shared)
async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);

  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  const bookingId = params.bookingId;
  if (!bookingId) {
    return NextResponse.json(
      { success: false, message: "Booking ID is required." },
      { status: 400 }
    );
  }

  try {
    const booking = await findBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    // --- Authorization Check ---
    // Ensure the logged-in user is the one who made this booking
    if (booking.userId !== userId) {
      console.warn(
        `Authorization failed: User ${userId} attempted to access booking ${bookingId} owned by ${booking.userId}`
      );
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to view this booking.",
        },
        { status: 403 }
      ); // Forbidden
    }
    // --------------------------

    // Fetch associated event details
    const event = await findEventById(booking.eventId);
    if (!event) {
      // This shouldn't happen if data is consistent, but handle it
      console.error(
        `Data inconsistency: Event ${booking.eventId} not found for booking ${bookingId}`
      );
      return NextResponse.json(
        { success: false, message: "Associated event data not found." },
        { status: 404 }
      );
    }

    // Return both booking and event details (omit sensitive event data like full seat map if not needed)
    const { seats: eventSeats, ...eventDetails } = event; // Exclude full seat map from response

    return NextResponse.json({ success: true, booking, event: eventDetails });
  } catch (error) {
    console.error(`API Error fetching booking ${bookingId}:`, error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
