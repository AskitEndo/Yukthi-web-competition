"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/lib/types";
import SeatComponent from "@/components/Seat";
import AppLoader from "@/components/AppLoader";
import {
  CalendarDays,
  Ticket,
  MapPin,
  AlertTriangle,
  DollarSign,
  Users,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const eventId = params.eventid as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const fetchEventData = useCallback(async () => {
    if (!eventId) return;
    setIsLoadingEvent(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setEvent(data.event);
      } else {
        throw new Error(data.message || "Could not load event data.");
      }
    } catch (err: any) {
      console.error("Error fetching event:", err);
      setError(err.message || "Failed to load event details.");
      setEvent(null);
    } finally {
      setIsLoadingEvent(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId && !isAuthLoading) {
      if (!user) {
        router.push(`/login?next=/events/${eventId}/book`);
      } else {
        fetchEventData();
      }
    }
  }, [eventId, user, isAuthLoading, router, fetchEventData]);

  const handleSelectSeat = (seatId: string) => {
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatId)) {
        return prevSelected.filter((id) => id !== seatId);
      } else {
        return [...prevSelected, seatId];
      }
    });
  };

  const processBooking = async (
    paymentMethod: "dummy_pay" | "pay_at_event"
  ) => {
    if (!user || selectedSeats.length === 0) {
      setBookingError("Please select seats and ensure you are logged in.");
      return;
    }
    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId,
          seatIds: selectedSeats,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`Booking successful with ID: ${data.bookingId}`);
        router.push(`/booking/${data.bookingId}`);
      } else {
        console.error("Booking API Error:", data.message);
        setBookingError(
          data.message || "Failed to create booking. Please try again."
        );
        setSelectedSeats([]);
      }
    } catch (err: any) {
      console.error("Process booking fetch error:", err);
      setBookingError("An unexpected error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleProceedToPayment = () => {
    processBooking("dummy_pay");
  };

  const handlePayAtEvent = () => {
    processBooking("pay_at_event");
  };

  if (isAuthLoading || isLoadingEvent) {
    return <AppLoader fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 relative">
        <div className="bg-red-100 border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 border-3 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-6 w-6 bg-yellow-400 border-3 border-black rounded-full"></div>

          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 border-3 border-black rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
              <AlertTriangle className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-red-700 text-center mb-2 uppercase tracking-wide font-boldonse">
            ERROR DETECTED!
          </h2>
          <p className="text-center text-red-700 font-bold relative z-10 font-space">
            {error}
          </p>

          <div className="mt-6 text-center">
            <Link
              href={`/events/${eventId}`}
              className="relative inline-block group"
            >
              <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={3} />
                Back to Event
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto mt-10 relative">
        <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 border-3 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-6 w-6 bg-purple-400 border-3 border-black rounded-full"></div>

          <p className="text-center text-gray-700 font-bold relative z-10 font-space">
            Event data could not be loaded.
          </p>

          <div className="mt-6 text-center">
            <Link href="/events" className="relative inline-block group">
              <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={3} />
                Browse Events
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const seatPrice = event.price || 5;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/events/${eventId}`}
          className="relative inline-block group"
        >
          <div className="bg-white border-[3px] border-black rounded-lg py-2 px-4 text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={3} />
            Back to Event
          </div>
          <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
        </Link>
      </div>

      {/* Event Header */}
      <div className="relative bg-white border-4 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 border-2 border-black rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-4 uppercase tracking-wide relative inline-block font-boldonse">
            Book Seats for:
            <span className="ml-2 bg-yellow-400 border-3 border-black px-2 py-1 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0)] rotate-1 inline-block transform">
              {event.name}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center bg-blue-100 border-3 border-black rounded-lg px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
              <CalendarDays
                className="h-4 w-4 mr-2 text-blue-700"
                strokeWidth={3}
              />
              <span className="font-bold text-black font-space">
                {new Date(event.date).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center bg-purple-100 border-3 border-black rounded-lg px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
              <MapPin
                className="h-4 w-4 mr-2 text-purple-700"
                strokeWidth={3}
              />
              <span className="font-bold text-black font-space">
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="bg-white border-4 border-black rounded-xl p-4 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "6px 6px",
          }}
        ></div>

        <h3 className="text-lg font-bold text-black mb-3 uppercase font-boldonse">
          Seat Guide
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-200 border-2 border-black rounded mr-2 shadow-[1px_1px_0px_0px_rgba(0,0,0)]"></div>
            <span className="font-bold text-sm font-space">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-400 border-2 border-black rounded mr-2 shadow-[1px_1px_0px_0px_rgba(0,0,0)]"></div>
            <span className="font-bold text-sm font-space">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-500 border-2 border-black rounded mr-2 shadow-[1px_1px_0px_0px_rgba(0,0,0)]"></div>
            <span className="font-bold text-sm font-space">Booked</span>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="bg-yellow-400 border-4 border-black rounded-xl py-2 mb-6 text-center font-bold uppercase text-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] relative font-boldonse">
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
        <Sparkles className="inline-block h-4 w-4 mr-2" strokeWidth={3} />
        STAGE
        <Sparkles className="inline-block h-4 w-4 ml-2" strokeWidth={3} />
      </div>

      {/* Seat Grid */}
      <div className="bg-white border-4 border-black rounded-xl p-6 mb-8 shadow-[7px_7px_0px_0px_rgba(0,0,0)] relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        <div className="flex flex-col items-center space-y-2 overflow-x-auto py-4 relative z-10">
          {event.seats.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex space-x-1">
              <span className="w-7 h-8 flex items-center justify-center text-xs font-bold text-black bg-gray-200 border-2 border-black rounded mr-2 shadow-[1px_1px_0px_0px_rgba(0,0,0)] font-boldonse">
                {`R${rowIndex + 1}`}
              </span>
              {row.map((seat) => (
                <SeatComponent
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.id)}
                  onSelect={handleSelectSeat}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        <div className="bg-blue-400 py-3 px-6 border-b-4 border-black relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
              backgroundSize: "6px 6px",
            }}
          ></div>
          <h2 className="text-xl font-extrabold text-black relative z-10 flex items-center uppercase tracking-wide font-boldonse">
            <Ticket className="mr-2 h-5 w-5" strokeWidth={3} />
            Your Selection
          </h2>
        </div>

        <div className="p-6 relative z-10">
          {bookingError && (
            <div className="mb-6 bg-red-100 border-3 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] relative">
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              <p className="font-bold text-red-700 font-space">
                <AlertTriangle
                  className="inline-block h-4 w-4 mr-2"
                  strokeWidth={3}
                />
                {bookingError}
              </p>
            </div>
          )}

          {isBooking && <AppLoader />}

          {!isBooking && selectedSeats.length === 0 ? (
            <div className="bg-gray-100 border-3 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-center relative">
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-400 border-2 border-black rounded-full"></div>
              <p className="text-gray-700 font-bold font-space">
                Select seats from the grid above.
              </p>
            </div>
          ) : null}

          {!isBooking && selectedSeats.length > 0 ? (
            <>
              <div className="bg-green-100 border-3 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] mb-6 relative">
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
                <h3 className="text-lg font-bold mb-3 text-black uppercase font-boldonse">
                  <Users
                    className="inline-block h-4 w-4 mr-2"
                    strokeWidth={3}
                  />
                  Selected Seats
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {selectedSeats.sort().map((seatId) => (
                    <li
                      key={seatId}
                      className="bg-blue-200 border-2 border-black px-2 py-1 rounded-lg inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-bold text-blue-800 font-space"
                    >
                      Seat {seatId}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-100 border-3 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)] mb-6 relative">
                <div className="absolute -top-2 -left-2 h-4 w-4 bg-yellow-500 border-2 border-black rounded-full"></div>
                <p className="text-lg font-bold text-black flex items-center justify-between font-boldonse">
                  <span className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" strokeWidth={3} />
                    Total:
                  </span>
                  <span className="bg-white border-3 border-black px-3 py-1 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                    <span className="font-space">
                      {selectedSeats.length} x ${seatPrice.toFixed(2)} =
                    </span>
                    <span className="ml-2 text-green-700">
                      ${(selectedSeats.length * seatPrice).toFixed(2)}
                    </span>
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleProceedToPayment}
                  disabled={isBooking}
                  className={`flex-1 relative bg-green-500 border-[3px] border-black rounded-lg py-3 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse uppercase ${
                    isBooking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <CreditCard className="h-5 w-5 mr-2" strokeWidth={3} />
                    {isBooking ? "Processing..." : "Make Payment (Dummy)"}
                  </span>
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
                </button>
                <button
                  onClick={handlePayAtEvent}
                  disabled={isBooking}
                  className={`flex-1 relative bg-orange-500 border-[3px] border-black rounded-lg py-3 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse uppercase ${
                    isBooking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <Wallet className="h-5 w-5 mr-2" strokeWidth={3} />
                    {isBooking ? "Processing..." : "Pay at Event"}
                  </span>
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-400 border-2 border-black rounded-full"></div>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
