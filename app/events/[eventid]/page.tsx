// app/events/[eventId]/page.tsx
import { findEventById } from "@/lib/data-utils"; // Adjust path if needed
import { Event } from "@/lib/types"; // Adjust path if needed
import { notFound } from "next/navigation";
import Link from "next/link";
import EventImage from "@/components/EventImage";
import Image from "next/image";

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
  params: { eventId: string };
}

// Custom fallback component for when no poster image is available
function EventPlaceholder({ name }: { name: string }) {
  return (
    <div className="relative w-full h-full aspect-[2/3] bg-gradient-to-r from-red-500 to-blue-500 border-2 border-black rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
      ></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="bg-yellow-400 border-3 border-black py-2 px-4 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform rotate-2 mb-4">
          <span className="text-black font-extrabold font-boldonse text-xl uppercase text-center">
            EVENT
          </span>
        </div>
        <div className="text-white font-space font-bold text-center">
          {name}
        </div>
      </div>
      <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
      <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const eventId = params.eventId;
  const event: Event | undefined = await findEventById(eventId);

  // If event is not found, display a 404 page
  if (!event) {
    notFound(); // This function from next/navigation renders the default 404 page
  }

  // Prepare image URLs with fallbacks
  const bannerUrl = event.bannerImageUrl || null; // No banner fallback

  return (
    <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
      {/* Comic book style decoration */}
      <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 border-2 border-black rounded-full z-10"></div>
      <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-10"></div>

      {/* Halftone pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }}
      ></div>

      {/* Optional Banner Image - Only show if exists */}
      {bannerUrl && (
        <EventImage
          src={bannerUrl}
          alt={`${event.name} banner`}
          isBanner={true}
        />
      )}

      <div className="p-6 md:p-8 relative z-10">
        <div className="md:flex md:items-start md:space-x-6">
          {/* Poster Image with Fallback */}
          <div className="md:w-1/3 lg:w-1/4 mb-4 md:mb-0 flex-shrink-0">
            {event.posterImageUrl ? (
              <EventImage
                src={event.posterImageUrl}
                alt={`${event.name} poster`}
              />
            ) : (
              <EventPlaceholder name={event.name} />
            )}
          </div>

          {/* Event Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-black font-boldonse uppercase tracking-wide">
              {event.name}
            </h1>

            <div className="bg-blue-100 border-2 border-black rounded-lg p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative inline-block">
              <p className="text-lg text-black font-bold font-space">
                {formatEventDate(event.date)}
              </p>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            </div>

            <div className="mb-5 bg-yellow-100 border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
              <h2 className="text-xl font-bold mb-2 text-black font-boldonse uppercase">
                Location
              </h2>
              <p className="text-black font-medium font-space">
                {event.location || "To be announced"}
              </p>
              {event.locationUrl && (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block bg-green-400 border-2 border-black rounded-lg py-1 px-3 text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse"
                >
                  View on map
                </a>
              )}
              <div className="absolute -top-2 -left-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
            </div>

            <div className="mb-6 bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
              <h2 className="text-xl font-bold mb-2 text-black font-boldonse uppercase">
                About the Event
              </h2>
              {/* Basic paragraph splitting - improve if markdown/rich text is needed later */}
              <div className="font-space">
                {event.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-black mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
            </div>

            {/* Price information */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="bg-red-400 border-2 border-black rounded-lg py-2 px-4 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] inline-block transform rotate-2 font-boldonse">
                <span className="text-xl">
                  ₹{event.price ? event.price.toFixed(2) : "5.00"}
                </span>
              </div>
              <div className="bg-purple-100 border-2 border-black rounded-lg py-2 px-4 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] inline-block transform -rotate-1 font-space">
                <span>{event.capacity || 0} seats available</span>
              </div>
            </div>

            {/* Booking Button */}
            <div className="mt-6 text-center md:text-left">
              <Link
                href={`/events/${event.id}/book`}
                className="relative inline-block group"
              >
                <div className="bg-blue-500 border-[3px] border-black rounded-lg py-3 px-8 text-lg font-extrabold text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse">
                  Book Seats Now!
                </div>
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
