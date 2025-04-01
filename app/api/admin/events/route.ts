// app/api/admin/events/route.ts
import "server-only";
import { getEvents, saveEvents, generateSeats } from "@/lib/data-utils"; // Adjust paths
import { Event, Seat } from "@/lib/types"; // Adjust paths
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Uses uuid installed previously

// We'll add authentication check here later
// For now, assume the request is authorized

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation (add more robust checks)
    const {
      name,
      description,
      date,
      location,
      locationUrl,
      posterImageUrl,
      bannerImageUrl,
      rows,
      cols,
    } = body;
    if (
      !name ||
      !description ||
      !date ||
      !location ||
      !posterImageUrl ||
      !rows ||
      !cols
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required event fields." },
        { status: 400 }
      );
    }

    const numRows = parseInt(rows, 10);
    const numCols = parseInt(cols, 10);

    if (
      isNaN(numRows) ||
      isNaN(numCols) ||
      numRows <= 0 ||
      numCols <= 0 ||
      numRows > 50 ||
      numCols > 50
    ) {
      // Add reasonable limits
      return NextResponse.json(
        {
          success: false,
          message: "Invalid rows or columns number (must be positive, max 50).",
        },
        { status: 400 }
      );
    }

    // Generate the seat map
    const seats: Seat[][] = generateSeats(numRows, numCols);

    const newEvent: Event = {
      id: uuidv4(), // Generate unique ID
      name,
      description,
      date, // Expecting ISO string format from client e.g., "2024-12-25T19:00:00.000Z"
      location,
      locationUrl: locationUrl || undefined, // Optional field
      posterImageUrl,
      bannerImageUrl: bannerImageUrl || undefined, // Optional field
      rows: numRows,
      cols: numCols,
      seats: seats,
    };

    const events = await getEvents();
    events.push(newEvent);
    const saved = await saveEvents(events);

    if (saved) {
      return NextResponse.json(
        { success: true, event: newEvent },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to save event data.");
    }
  } catch (error) {
    console.error("Event Creation API Error:", error);
    let message = "An internal server error occurred.";
    if (error instanceof SyntaxError) {
      // Handle JSON parsing errors specifically
      message = "Invalid request format.";
    } else if (error instanceof Error) {
      message = error.message; // Use specific error message if available
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
