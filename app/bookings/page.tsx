"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDate } from "@/lib/date-utils";
import {
  Ticket,
  Clock,
  CalendarDays,
  Calendar,
  User,
  DollarSign,
  ArrowRight,
  AlertTriangle,
  Home,
  Search,
  Sparkles,
} from "lucide-react";

// Define types for your booking data
interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  seats: string[];
  bookingTime: string; // ISO date string
  paymentStatus: "paid" | "pending";
  amount: number;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/user/bookings");
        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings || []);
        } else {
          setError(data.message || "Failed to load bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading) {
      if (!user) {
        router.push("/login?next=/bookings");
      } else {
        fetchBookings();
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] text-center relative overflow-hidden">
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
      <div className="flex justify-between items-center mb-10">
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide font-boldonse inline-block relative z-10">
            MY BOOKINGS
          </h1>
          <div className="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400 -z-0"></div>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
        </div>
        <Link href="/events" className="relative inline-block group">
          <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
            <Search className="h-4 w-4 mr-2" strokeWidth={3} />
            Find Events
          </div>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
            <Ticket className="h-8 w-8 text-blue-600" strokeWidth={3} />
          </div>

          <p className="text-xl text-black font-bold font-boldonse relative z-10 uppercase mb-4">
            You haven't made any bookings yet!
          </p>

          <Link href="/events" className="relative inline-block group">
            <div className="bg-green-500 border-[3px] border-black rounded-lg py-3 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
              <ArrowRight className="h-5 w-5 mr-2" strokeWidth={3} />
              Browse Events
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_8px_0px_0px_rgba(0,0,0)]"
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
                  backgroundSize: "8px 8px",
                }}
              ></div>

              <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

              <div className="bg-purple-400 py-2 px-4 border-b-4 border-black relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                    backgroundSize: "6px 6px",
                  }}
                ></div>
                <h2 className="font-extrabold text-black relative z-10 text-lg font-boldonse uppercase tracking-wide">
                  <Sparkles
                    className="inline-block h-4 w-4 mr-2"
                    strokeWidth={3}
                  />
                  {booking.eventName}
                </h2>
              </div>

              <div className="p-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="space-y-3">
                    <div className="bg-blue-100 border-3 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0)] relative">
                      <div className="absolute -top-2 -right-2 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
                      <p className="text-black font-medium font-space flex items-center">
                        <User
                          className="h-4 w-4 mr-2 text-blue-700"
                          strokeWidth={3}
                        />
                        <span className="font-bold">Booking ID:</span>
                        <span className="ml-2 font-mono bg-white border-2 border-black px-2 py-0.5 rounded text-sm">
                          {booking.id}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="bg-green-100 border-3 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)] inline-flex items-center">
                        <Clock
                          className="h-4 w-4 mr-2 text-green-700"
                          strokeWidth={3}
                        />
                        <span className="text-black font-bold font-space">
                          {formatDate(booking.bookingTime)}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center border-3 border-black rounded-lg px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse text-sm uppercase
                          ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-400 text-black"
                              : "bg-yellow-400 text-black"
                          }`}
                      >
                        <DollarSign className="h-4 w-4 mr-1" strokeWidth={3} />
                        {booking.paymentStatus === "paid"
                          ? "PAID"
                          : "PAY AT EVENT"}
                      </div>
                    </div>

                    <div className="bg-yellow-100 border-3 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0)] relative">
                      <div className="absolute -top-2 -left-2 h-3 w-3 bg-yellow-500 border-2 border-black rounded-full"></div>
                      <p className="text-black font-medium font-space">
                        <Ticket
                          className="h-4 w-4 mr-2 text-yellow-700 inline"
                          strokeWidth={3}
                        />
                        <span className="font-bold">Seats:</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {booking.seats.map((seat) => (
                          <span
                            key={seat}
                            className="bg-white border-2 border-black px-2 py-1 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)] text-sm font-bold font-space"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="self-end">
                    <Link
                      href={`/booking/${booking.id}`}
                      className="relative inline-block group"
                    >
                      <div className="bg-purple-600 border-[3px] border-black rounded-lg py-3 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse uppercase flex items-center">
                        <ArrowRight className="h-5 w-5 mr-2" strokeWidth={3} />
                        View Details
                      </div>
                      <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
