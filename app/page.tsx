// app/page.tsx

import { getEvents } from "@/lib/data-utils"; // Adjust path if needed
import EventCard from "@/components/EventCard"; // Adjust path if needed
import { Event } from "@/lib/types"; // Adjust path if needed

export default async function HomePage() {
  // Fetch events on the server side
  const events: Event[] = await getEvents();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          No events scheduled yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Add revalidation if data changes frequently without server restarts
// export const revalidate = 60; // Revalidate data every 60 seconds
