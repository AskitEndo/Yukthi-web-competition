// app/api/bookings/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import {
  getEvents,
  saveEvents,
  getBookings,
  saveBookings,
  findEventById,
} from "@/lib/data-utils";
import { Event, Booking, User } from "@/lib/types";

// Reuse JWT constants
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
);
const COOKIE_NAME = "session";

// Helper to get authenticated user payload
async function getAuthPayload(): Promise<{
  userId: string;
  username: string;
  isAdmin: boolean;
} | null> {
  const tokenCookie = cookies();
  tokenCookie.get(COOKIE_NAME);
  if (!tokenCookie) return null;
  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    // Basic check for expected payload structure
    if (
      typeof payload.userId === "string" &&
      typeof payload.username === "string" &&
      typeof payload.isAdmin === "boolean"
    ) {
      return payload as { userId: string; username: string; isAdmin: boolean };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const authPayload = await getAuthPayload();
  if (!authPayload) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }
  const userId = authPayload.userId;

  try {
    const { eventId, seatIds, paymentMethod } = await request.json();

    // Validation
    if (
      !eventId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0 ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required booking information." },
        { status: 400 }
      );
    }
    if (paymentMethod !== "dummy_pay" && paymentMethod !== "pay_at_event") {
      return NextResponse.json(
        { success: false, message: "Invalid payment method specified." },
        { status: 400 }
      );
    }

    // --- Critical Section: Fetch, Check, Update Event ---
    const events = await getEvents(); // Get all events (can optimize if needed)
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    const eventToUpdate = JSON.parse(
      JSON.stringify(events[eventIndex])
    ) as Event; // Deep copy to avoid mutation issues

    // Concurrency Check: Verify seats are still available *now*
    let seatsAreAvailable = true;
    const seatsToBookMap = new Map<string, { row: number; col: number }>(); // Store seat details for easier update

    for (const seatId of seatIds) {
      const [_, rowStr, colStr] = seatId.match(/^R(\d+)C(\d+)$/) || []; // Extract row/col numbers from ID like "R1C5"
      const rowNum = parseInt(rowStr, 10);
      const colNum = parseInt(colStr, 10);

      if (
        !rowNum ||
        !colNum ||
        rowNum <= 0 ||
        colNum <= 0 ||
        rowNum > eventToUpdate.rows ||
        colNum > eventToUpdate.cols
      ) {
        console.error(`Invalid seat ID format or out of bounds: ${seatId}`);
        return NextResponse.json(
          { success: false, message: `Invalid seat ID format: ${seatId}.` },
          { status: 400 }
        );
      }

      const seat = eventToUpdate.seats[rowNum - 1]?.[colNum - 1]; // Access seat in the 2D array (0-indexed)

      if (!seat || seat.isBooked) {
        console.warn(
          `Seat conflict: Seat ${seatId} for event ${eventId} is already booked or invalid.`
        );
        seatsAreAvailable = false;
        break; // Stop checking if one seat is unavailable
      }
      seatsToBookMap.set(seatId, { row: rowNum, col: colNum });
    }

    if (!seatsAreAvailable) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected seats are no longer available. Please try again.",
        },
        { status: 409 }
      ); // 409 Conflict
    }

    // Update the seats in the copied event object
    seatsToBookMap.forEach(({ row, col }, seatId) => {
      eventToUpdate.seats[row - 1][col - 1].isBooked = true;
      eventToUpdate.seats[row - 1][col - 1].userId = userId; // Assign booking user
    });

    // Save the updated event list back to the file
    events[eventIndex] = eventToUpdate; // Replace the original event with the updated one
    const eventSaveSuccess = await saveEvents(events);
    if (!eventSaveSuccess) {
      console.error("Failed to save updated events file after booking.");
      // Potential rollback logic could be added here, but complex with JSON files
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update event status. Please try again later.",
        },
        { status: 500 }
      );
    }
    // --- End Critical Section ---

    // --- Create Booking Record ---
    const bookingId = uuidv4();
    const newBooking: Booking = {
      id: bookingId,
      eventId: eventId,
      userId: userId,
      seats: seatIds.sort(), // Store sorted seat IDs
      bookingTime: new Date().toISOString(),
      paymentStatus: paymentMethod === "dummy_pay" ? "paid" : "pay_at_event",
    };

    const bookings = await getBookings();
    bookings.push(newBooking);
    const bookingSaveSuccess = await saveBookings(bookings);

    if (!bookingSaveSuccess) {
      console.error("Failed to save new booking record after event update.");
      // Data inconsistency! Event seats are booked, but booking record failed.
      // Manual intervention might be needed. Log this prominently.
      // For the user, probably still return an error.
      return NextResponse.json(
        {
          success: false,
          message: "Booking record failed to save. Please contact support.",
        },
        { status: 500 }
      );
    }
    // --- End Booking Record Creation ---

    // Success! Return the new booking ID
    return NextResponse.json({ success: true, bookingId: bookingId });
  } catch (error) {
    console.error("Booking Creation API Error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid request format." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred during booking.",
      },
      { status: 500 }
    );
  }
}
