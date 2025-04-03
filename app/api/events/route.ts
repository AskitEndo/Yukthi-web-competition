// app/api/events/route.ts
import "server-only";
import { getEvents } from "@/lib/data-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all events from data store
    const events = await getEvents();

    // Only return published events for public endpoint
    const publishedEvents = events.filter((event) => event.published);

    // Calculate available seats if needed
    const eventsWithAvailability = publishedEvents.map((event) => {
      // If the event already has availableSeats property, use it
      //   if (typeof event.availableSeats === "number") {
      //     return event;
      //   }

      // Otherwise calculate from seats array if present
      if (event.seats && Array.isArray(event.seats)) {
        // Count all available seats (those without bookingId)
        const availableSeats = event.seats
          .flat()
          .filter((seat) => !seat.bookingId).length;
        return { ...event, availableSeats };
      }

      // If no seat data, use capacity as fallback
      if (typeof event.capacity === "number") {
        return { ...event, availableSeats: event.capacity };
      }

      // Default to 0 if no seat data available
      return { ...event, availableSeats: 0 };
    });

    return NextResponse.json({
      success: true,
      events: eventsWithAvailability,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        events: [],
      },
      { status: 500 }
    );
  }
}
