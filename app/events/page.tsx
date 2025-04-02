"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date-utils";
import LoadingSpinner from "@/components/LoadingSpinner";

// Import Lucide icons individually
import { Ticket } from "lucide-react";
import { MapPin } from "lucide-react";
import { Calendar } from "lucide-react";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { X } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Tag } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Home } from "lucide-react";
import { Flame } from "lucide-react";

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  posterImageUrl?: string;
  price: number;
  availableSeats: number;
  published: boolean;
}

export default function EventsListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch all events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched events:", data); // Debug log

        // Filter to only published events
        const publishedEvents =
          data.events?.filter((event: Event) => event.published) || [];

        setEvents(publishedEvents);
        setFilteredEvents(publishedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter and sort events
  useEffect(() => {
    if (events.length === 0) return;

    console.log("Running filter effect"); // Add debug log

    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          (event.name?.toLowerCase() || "").includes(term) ||
          (event.description?.toLowerCase() || "").includes(term) ||
          (event.location?.toLowerCase() || "").includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "date") {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      } else {
        const aValue = a[sortField as keyof Event] || "";
        const bValue = b[sortField as keyof Event] || "";

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : bValue > aValue
          ? 1
          : -1;
      }
    });

    setFilteredEvents(result);
  }, [events, searchTerm, sortField, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 border-3 border-black rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
              <AlertTriangle className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-red-700 text-center mb-2 uppercase tracking-wide font-boldonse">
            ERROR DETECTED!
          </h2>
          <p className="text-center text-red-700 font-bold relative z-10 font-space mb-6">
            {error}
          </p>

          <Link href="/" className="relative inline-block group">
            <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
              <Home className="h-4 w-4 mr-2" strokeWidth={3} />
              Return to Home
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="relative mb-4 md:mb-0">
          <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide font-boldonse inline-block relative z-10">
            UPCOMING EVENTS
          </h1>
          <div className="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400 -z-0"></div>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center space-x-3">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-10 py-2 w-full md:w-64 border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0)] font-space"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-4 w-4 text-gray-500" strokeWidth={3} />
              </button>
            )}
          </div>

          <div className="relative inline-block group">
            <button
              onClick={() => toggleSort("date")}
              className="relative bg-blue-500 text-white border-3 border-black rounded-lg py-2 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-boldonse text-sm flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" strokeWidth={3} />
              <span className="mr-1">SORT</span>
              <ArrowUpDown className="h-3 w-3" strokeWidth={3} />
            </button>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Events display */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0)] text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "8px 8px",
            }}
          ></div>
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-purple-400 border-2 border-black rounded-full"></div>

          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
            <Ticket className="h-8 w-8 text-blue-600" strokeWidth={3} />
          </div>

          <p className="text-xl text-black font-bold font-boldonse relative z-10 uppercase">
            {searchTerm
              ? "No events found matching your search"
              : "No events currently available"}
          </p>

          <p className="mt-2 text-gray-600 font-space">
            Please check back later for upcoming events!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group relative transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
                {/* Halftone pattern background */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
                    backgroundSize: "8px 8px",
                  }}
                ></div>

                {/* Decorative dots */}
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-400 border-2 border-black rounded-full z-10"></div>
                <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-10"></div>

                {/* Event Header */}
                <div className="bg-yellow-400 py-1 px-4 border-b-4 border-black relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                      backgroundSize: "6px 6px",
                    }}
                  ></div>

                  <div
                    className="absolute inset-0 z-10 mix-blend-multiply"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
                      backgroundSize: "4px 4px",
                    }}
                  ></div>

                  <div className="relative">
                    <h3 className="font-extrabold text-lg uppercase text-black tracking-wider font-boldonse">
                      {event.name}
                    </h3>
                  </div>
                </div>

                {/* Event Image */}
                <div className="relative h-48 overflow-hidden border-b-4 border-black">
                  {event.posterImageUrl ? (
                    <Image
                      src={event.posterImageUrl}
                      alt={event.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="transform group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center">
                      <Sparkles
                        className="h-16 w-16 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  {/* Event badges */}
                  <div className="absolute bottom-3 left-3 z-20">
                    {new Date(event.date) <
                      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-lg border-[3px] border-black transform rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                        <Flame
                          className="h-3 w-3 inline-block mr-1"
                          strokeWidth={2.5}
                        />
                        SOON
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div
                        className="bg-blue-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                        style={{ borderRadius: "8px" }}
                      >
                        <Calendar
                          className="h-3 w-3 inline-block mr-1"
                          strokeWidth={2.5}
                        />
                        {formatDate(event.date)}
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-300 border-[1px] border-black rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="bg-green-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                        style={{ borderRadius: "8px" }}
                      >
                        <MapPin
                          className="h-3 w-3 inline-block mr-1"
                          strokeWidth={2.5}
                        />
                        {event.location}
                        <div className="absolute -top-1 -left-1 h-2 w-2 bg-blue-500 border-[1px] border-black rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="bg-purple-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                        style={{ borderRadius: "8px" }}
                      >
                        <Tag
                          className="h-3 w-3 inline-block mr-1"
                          strokeWidth={2.5}
                        />
                        {event.price > 0 ? `₹${event.price}` : "FREE"}
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 border-[1px] border-black rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-end">
                    <div className="bg-yellow-100 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space inline-flex items-center">
                      <Ticket
                        className="h-3 w-3 text-yellow-700 mr-1"
                        strokeWidth={2.5}
                      />
                      {event.availableSeats > 0 ? (
                        <span>{event.availableSeats} seats left</span>
                      ) : (
                        <span className="text-red-500">SOLD OUT</span>
                      )}
                      <div className="absolute -right-2 top-1/2 w-3 h-3 bg-red-400 border-r-2 border-b-2 border-black transform rotate-45 -translate-y-1/2"></div>
                    </div>
                  </div>

                  <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Back to Top" button */}
      {filteredEvents.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative inline-block group"
          >
            <div className="bg-green-500 border-[3px] border-black rounded-lg py-2 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse uppercase tracking-wide flex items-center">
              <ArrowUpDown className="h-5 w-5 mr-2" strokeWidth={2.5} />
              Back To Top
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  );
}
