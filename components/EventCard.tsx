// components/EventCard.tsx
"use client"; // Ensure this component is client-side for interactivity

import Link from "next/link";
import Image from "next/image"; // Using next/image for potential optimization
import { Event } from "@/lib/types"; // Adjust path if needed

interface EventCardProps {
  event: Event;
}

// Helper to format date (can be moved to lib/utils.ts later)
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      // timeZone: 'UTC' // Uncomment if dates in JSON are UTC and you want to display them as such
    });
  } catch (e) {
    return "Invalid Date";
  }
}

export default function EventCard({ event }: EventCardProps) {
  const { id, name, date, location, posterImageUrl } = event;

  // Basic error handling for image path
  const imageUrl =
    posterImageUrl && posterImageUrl.startsWith("/")
      ? posterImageUrl
      : "/images/posters/placeholder-poster.png"; // Default fallback

  return (
    <Link
      href={`/events/${id}`}
      className="block group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <div className="relative w-full h-48">
        {" "}
        {/* Fixed height container for image */}
        {/* Using standard img for simplicity with local paths first */}
        <img
          src={imageUrl}
          alt={`${name} poster`}
          className="w-full h-full object-cover" // Ensure image covers the area
          onError={(e) => {
            // If image fails to load, replace with placeholder
            e.currentTarget.src = "/images/posters/placeholder-poster.png";
          }}
        />
        {/* If using next/image and external URLs or needing optimization:
         <Image
          src={imageUrl} // Can be relative or absolute URL
          alt={`${name} poster`}
          fill // Makes image fill the relative container
          style={{ objectFit: 'cover' }} // CSS equivalent of object-cover
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
          priority={false} // Set true for above-the-fold images
        /> */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{formatDate(date)}</p>
        <p className="text-sm text-gray-500 truncate">{location}</p>
      </div>
    </Link>
  );
}
