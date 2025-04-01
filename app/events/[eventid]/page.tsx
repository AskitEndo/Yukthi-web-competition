// app/events/[eventId]/page.tsx
import { findEventById } from "@/lib/data-utils"; // Adjust path if needed
import { Event } from "@/lib/types"; // Adjust path if needed
import { notFound } from "next/navigation";
import Link from "next/link";
import EventImage from "@/components/EventImage";

// Re-use or move this formatting function to a shared utils file later
function formatEventDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long", // e.g., Thursday
      year: "numeric", // e.g., 2024
      month: "long", // e.g., August
      day: "numeric", // e.g., 15
      hour: "numeric", // e.g., 7
      minute: "2-digit", // e.g., 00
      hour12: true, // Use AM/PM
      // timeZone: 'UTC' // Optional: Specify if your date strings are UTC
    });
  } catch (e) {
    return "Invalid Date";
  }
}

// Define props structure including params
interface EventDetailPageProps {
  params: { eventid: string };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const eventId = params.eventid;
  const event: Event | undefined = await findEventById(eventId);

  // If event is not found, display a 404 page
  if (!event) {
    notFound(); // This function from next/navigation renders the default 404 page
  }

  // Prepare image URLs with fallbacks
  const bannerUrl =
    event.bannerImageUrl && event.bannerImageUrl.startsWith("/")
      ? event.bannerImageUrl
      : null; // No banner fallback for now, could add one
  const posterUrl =
    event.posterImageUrl && event.posterImageUrl.startsWith("/")
      ? event.posterImageUrl
      : "/images/posters/placeholder-poster.png"; // Default fallback

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Optional Banner Image */}
      {bannerUrl && (
        <EventImage
          src={bannerUrl}
          alt={`${event.name} banner`}
          isBanner={true}
        />
      )}

      <div className="p-6 md:p-8">
        <div className="md:flex md:items-start md:space-x-6">
          {/* Poster Image */}
          <div className="md:w-1/3 lg:w-1/4 mb-4 md:mb-0 flex-shrink-0">
            <EventImage src={posterUrl} alt={`${event.name} poster`} />
          </div>

          {/* Event Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
              {event.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {formatEventDate(event.date)}
            </p>

            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                Location
              </h2>
              <p className="text-gray-600">{event.location}</p>
              {event.locationUrl && (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm inline-block mt-1"
                >
                  View on map
                </a>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                About the Event
              </h2>
              {/* Basic paragraph splitting - improve if markdown/rich text is needed later */}
              {event.description.split("\n").map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Booking Button */}
            <div className="mt-6 text-center md:text-left">
              <Link
                href={`/events/${event.id}/book`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Book Seats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
