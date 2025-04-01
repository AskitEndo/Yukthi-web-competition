"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Ticket,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/date-utils";

export default function EventCard({ event }: any) {
  const router = useRouter();
  const { user } = useAuth();

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Important: prevent the card click from also triggering

    if (!user) {
      // Redirect to login page with a redirect URL back to the event
      router.push(`/login?next=/events/${event.id}/book`);
    } else {
      // User is logged in, go to the event booking page
      router.push(`/events/${event.id}/book`);
    }
  };

  const navigateToEventDetails = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div
      className="group relative transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      onClick={navigateToEventDetails}
    >
      {/* Comic book style card with thick border and shadow */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
        {/* Comic style header strip */}
        <div className="bg-yellow-400 py-1 px-4 border-b-4 border-black relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="relative">
            <h3 className="font-extrabold text-lg uppercase text-black tracking-wider font-boldonse">
              {event.name}
            </h3>
          </div>
        </div>

        {/* Event image with comic overlay */}
        <div className="relative h-48 overflow-hidden border-b-4 border-black">
          <div
            className="absolute inset-0 z-10 mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: "4px 4px",
            }}
          ></div>
          {event.image ? (
            <Image
              src={event.image}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl font-space">
                EVENT
              </span>
            </div>
          )}

          {/* Comic burst for the date */}
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-lg border-[3px] border-black transform rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                <Calendar
                  className="h-3 w-3 mr-1 inline-block"
                  strokeWidth={3}
                />
                {formatDate(event.date)}
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full"></div>
            </div>
          </div>

          {/* Price tag bubble */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="relative">
              <div className="bg-yellow-300 text-black font-extrabold px-3 py-1 rounded-lg border-[3px] border-black transform rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                <Ticket className="h-3 w-3 mr-1 inline-block" strokeWidth={3} />
                $5 per seat
              </div>
              <div className="absolute -top-1 -left-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4">
          {/* Details with comic speech bubbles */}
          <div className="space-y-3 mb-4">
            {/* Location bubble */}
            <div className="flex items-center">
              <div className="relative inline-block">
                <div
                  className="bg-blue-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                  style={{ borderRadius: "8px" }}
                >
                  <MapPin
                    className="h-3 w-3 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  <span className="relative z-10">{event.location}</span>
                </div>
                <div className="absolute -right-2 top-1/2 w-3 h-3 bg-blue-400 border-r-2 border-b-2 border-black transform rotate-45 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Time bubble */}
            <div className="flex items-center justify-end">
              <div className="relative inline-block">
                <div
                  className="bg-green-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                  style={{ borderRadius: "8px" }}
                >
                  <Clock
                    className="h-3 w-3 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  <span className="relative z-10">{event.time}</span>
                </div>
                <div className="absolute -left-2 top-1/2 w-3 h-3 bg-green-400 border-l-2 border-t-2 border-black transform rotate-45 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Seats bubble */}
            <div className="flex items-center">
              <div className="relative inline-block">
                <div
                  className="bg-red-400 text-xs font-bold px-2 py-1 border-2 border-black rounded-lg relative font-space"
                  style={{ borderRadius: "8px" }}
                >
                  <Users
                    className="h-3 w-3 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  <span className="relative z-10">
                    {event.availableSeats} seats left
                  </span>
                </div>
                <div className="absolute -right-2 top-1/2 w-3 h-3 bg-red-400 border-r-2 border-b-2 border-black transform rotate-45 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Action button - Separate from card click */}
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateToEventDetails();
              }}
              className="flex-1 mr-2"
            >
              <div className="relative inline-block w-full group">
                <div className="bg-blue-400 border-[3px] border-black rounded-lg py-2 text-center font-extrabold text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse">
                  <span className="mr-1">DETAILS</span>
                  <ArrowRight
                    className="h-4 w-4 inline-block"
                    strokeWidth={3}
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </div>
            </button>

            <button onClick={handleBooking} className="flex-1">
              <div className="relative inline-block w-full group">
                <div className="bg-yellow-400 border-[3px] border-black rounded-lg py-2 text-center font-extrabold text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse">
                  <span className="mr-1">BOOK</span>
                  <Zap className="h-4 w-4 inline-block" strokeWidth={3} />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
