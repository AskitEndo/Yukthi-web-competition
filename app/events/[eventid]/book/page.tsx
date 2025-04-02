"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/lib/types";
import SeatComponent from "@/components/Seat";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const eventId = params.eventId as string; // Match folder name case

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false); // Add booking loading state
  const [bookingError, setBookingError] = useState<string | null>(null); // Specific error state for booking actions

  // Fetch event data on component mount
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

  // --- Updated Booking Action Function ---
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
        // Booking successful! Redirect to confirmation page
        console.log(`Booking successful with ID: ${data.bookingId}`);
        router.push(`/booking/${data.bookingId}`);
      } else {
        // Booking failed
        console.error("Booking API Error:", data.message);
        setBookingError(
          data.message || "Failed to create booking. Please try again."
        );
        setSelectedSeats([]); // Clear selection on conflict error might be user-friendly
      }
    } catch (err: any) {
      console.error("Process booking fetch error:", err);
      setBookingError("An unexpected error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  // Use the new function in handlers
  const handleProceedToPayment = () => {
    processBooking("dummy_pay");
  };

  const handlePayAtEvent = () => {
    processBooking("pay_at_event");
  };

  // Display loading state
  if (isAuthLoading || isLoadingEvent) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10 bg-red-100 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Event data could not be loaded.
      </div>
    );
  }

  // Example fixed price per seat
  const seatPrice = 5;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Book Seats for: {event.name}
      </h1>
      <p className="text-gray-600 mb-6">
        {new Date(event.date).toLocaleString()}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-green-200 border border-gray-400 rounded mr-2"></span>
          Available
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 border border-blue-700 rounded mr-2"></span>
          Selected
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-gray-500 border  border-gray-400 rounded mr-2"></span>
          Booked
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-400 border  border-gray-400 rounded mr-2"></span>
          Marked
        </div>
      </div>

      {/* Stage Indicator */}
      <div className="w-full bg-gray-300 border-4 border-blue-800 text-center py-2 mb-4 rounded text-sm font-medium text-gray-700 shadow">
        STAGE
      </div>

      {/* Seating Grid */}
      <div className="flex flex-col items-center space-y-1 overflow-x-auto pb-4">
        {event.seats.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex space-x-1">
            <span className="w-6 h-8 flex items-center justify-center text-xs font-medium text-gray-500 mr-1">{`R${
              rowIndex + 1
            }`}</span>
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

      {/* Selection Summary & Actions */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Your Selection
        </h2>

        {/* Display Booking Error */}
        {bookingError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {bookingError}
          </div>
        )}

        {/* Display Booking Loading state */}
        {isBooking && <LoadingSpinner />}

        {!isBooking && selectedSeats.length === 0 ? (
          <p className="text-gray-500">Select seats from the grid above.</p>
        ) : null}

        {!isBooking && selectedSeats.length > 0 ? (
          <>
            <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
              {selectedSeats.sort().map((seatId) => (
                <li key={seatId}>Seat {seatId}</li>
              ))}
            </ul>
            <p className="text-lg font-medium mb-6 text-emerald-800">
              Total: {selectedSeats.length} seats x ₹{seatPrice.toFixed(2)} =
              <span className="font-bold ml-2">
                ₹{(selectedSeats.length * seatPrice).toFixed(2)}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleProceedToPayment}
                disabled={isBooking}
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-center ${
                  isBooking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isBooking ? "Processing..." : "Make Payment (Dummy)"}
              </button>
              <button
                onClick={handlePayAtEvent}
                disabled={isBooking}
                className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-center ${
                  isBooking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isBooking ? "Processing..." : "Pay at Event"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
