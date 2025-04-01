import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getBookings, findEventById } from "@/lib/data-utils";

// JWT constants
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
);
const COOKIE_NAME = "session";

// Helper to get authenticated user ID
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

export async function GET(request: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    // Get all bookings
    const allBookings = await getBookings();

    // Filter bookings by the logged-in user
    const userBookings = allBookings.filter(
      (booking) => booking.userId === userId
    );

    // Enhance booking data with event information
    const enhancedBookings = await Promise.all(
      userBookings.map(async (booking) => {
        const event = await findEventById(booking.eventId);
        return {
          ...booking,
          eventName: event?.name || "Unknown Event",
        };
      })
    );

    return NextResponse.json({
      success: true,
      bookings: enhancedBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}
