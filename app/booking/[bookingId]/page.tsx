"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode"; // Import QR code generator
import { useAuth } from "@/context/AuthContext";
import { Booking, Event } from "@/lib/types";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface BookingDetails extends Booking {
  // Add event details we expect from the API
  event: Omit<Event, "seats">; // Event details excluding the full seat map
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const bookingId = params.bookingId as string;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch booking data
  const fetchBookingData = useCallback(async () => {
    if (!bookingId || !user) return; // Need bookingId and logged-in user

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(
          errorData.message || `Failed to fetch booking: ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.success) {
        setBookingDetails(data); // API returns { success: true, booking: ..., event: ... }

        // --- Generate QR Code ---
        if (data.booking) {
          const qrJsonData = JSON.stringify({
            bookingId: data.booking.id,
            eventId: data.booking.eventId,
            userId: data.booking.userId,
            seats: data.booking.seats,
            eventName: data.event?.name, // Add some context
          });
          // Generate QR code as Data URL
          QRCode.toDataURL(
            qrJsonData,
            { errorCorrectionLevel: "M" },
            (err, url) => {
              if (err) {
                console.error("QR Code generation failed:", err);
                setError("Failed to generate QR code."); // Show error to user
              } else {
                setQrCodeDataUrl(url);
              }
            }
          );
        }
        // -----------------------
      } else {
        throw new Error(data.message || "Could not load booking data.");
      }
    } catch (err: any) {
      console.error("Error fetching booking:", err);
      setError(err.message || "Failed to load booking details.");
      // If unauthorized (403) or not found (404), redirect?
      if (err.message.includes("authorized") || err.message.includes("found")) {
        // Redirect to home or bookings page after a delay?
        // setTimeout(() => router.push('/'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, user]); // Add router to dependencies if used in error handling

  useEffect(() => {
    if (bookingId && !isAuthLoading) {
      if (!user) {
        // Fallback auth check (middleware should handle this)
        router.push(`/login?next=/booking/${bookingId}&message=Login required`);
      } else {
        fetchBookingData();
      }
    }
  }, [bookingId, user, isAuthLoading, router, fetchBookingData]); // Add dependencies

  // --- Render Logic ---
  if (isLoading || isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10 bg-red-100 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!bookingDetails || !bookingDetails.event) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Booking details could not be loaded.
      </div>
    );
  }

  // Destructure for easier access
  const { booking, event } = bookingDetails;

  const defaultPoster = "/images/posters/placeholder-poster.png";
  const posterUrl =
    event.posterImageUrl && event.posterImageUrl.startsWith("/")
      ? event.posterImageUrl
      : defaultPoster;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden my-10 p-6 md:p-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Booking Confirmed!
      </h1>

      <div className="mb-6 text-center">
        {!imageError ? (
          <Image
            src={posterUrl}
            alt={`${event.name} Poster`}
            width={200}
            height={300}
            className="mx-auto rounded shadow-md"
            style={{ objectFit: "contain" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={defaultPoster}
            alt={`${event.name} Poster`}
            width={200}
            height={300}
            className="mx-auto rounded shadow-md"
            style={{ objectFit: "contain" }}
          />
        )}
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">{event.name}</h2>
        <p>
          <strong className="font-medium text-gray-600">Date:</strong>{" "}
          {new Date(event.date).toLocaleString()}
        </p>
        <p>
          <strong className="font-medium text-gray-600">Location:</strong>{" "}
          {event.location}
          {event.locationUrl && (
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm ml-2"
            >
              (View Map)
            </a>
          )}
        </p>
        <p>
          <strong className="font-medium text-gray-600">Seats Booked:</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {booking.seats.map((seatId) => (
            <span
              key={seatId}
              className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {seatId}
            </span>
          ))}
        </div>
        <p>
          <strong className="font-medium text-gray-600">Payment Status:</strong>{" "}
          <span
            className={`font-semibold ${
              booking.paymentStatus === "paid"
                ? "text-green-600"
                : "text-orange-600"
            }`}
          >
            {booking.paymentStatus === "paid" ? "Paid" : "Pay at Event"}
          </span>
        </p>
        <p>
          <strong className="font-medium text-gray-600">Booking ID:</strong>{" "}
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {booking.id}
          </span>
        </p>
        <p>
          <strong className="font-medium text-gray-600">Booked On:</strong>{" "}
          {new Date(booking.bookingTime).toLocaleString()}
        </p>
      </div>

      {/* QR Code Display */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Your QR Code Ticket
        </h3>
        {qrCodeDataUrl ? (
          <img
            src={qrCodeDataUrl}
            alt="Booking QR Code"
            className="mx-auto border p-1 bg-white shadow-md"
            width="250"
            height="250"
          />
        ) : error ? ( // Show error if QR generation failed specifically
          <p className="text-red-500">Could not generate QR Code.</p>
        ) : (
          <LoadingSpinner size="medium" color="blue" /> // Show spinner while QR generates
        )}
        <p className="text-xs text-gray-500 mt-2">
          Scan this code at the event.
        </p>
      </div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <button
          onClick={() => router.push("/")} // Go back to homepage
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-150"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}
