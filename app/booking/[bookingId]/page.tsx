"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode"; // Import QR code generator
import { useAuth } from "@/context/AuthContext";
import { Booking, Event } from "@/lib/types";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Check,
  Calendar,
  MapPin,
  User,
  Clock,
  Ticket,
  CreditCard,
  Home,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// Update the type definition to match your API response structure
interface BookingResponse {
  success: boolean;
  booking: Booking;
  event: Omit<Event, "seats">; // Event details excluding the full seat map
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const bookingId = params.bookingId as string;

  const [bookingDetails, setBookingDetails] = useState<BookingResponse | null>(
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
            <button
              onClick={() => router.push("/")}
              className="relative inline-block group"
            >
              <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                <Home className="h-4 w-4 mr-2" strokeWidth={3} />
                Back to Home
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails || !bookingDetails.booking || !bookingDetails.event) {
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
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-purple-400 border-2 border-black rounded-full"></div>

          <p className="text-center text-black font-bold relative z-10 font-space">
            Booking details could not be loaded.
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="relative inline-block group"
            >
              <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                <Home className="h-4 w-4 mr-2" strokeWidth={3} />
                Back to Home
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destructure for easier access - access the booking and event via bookingDetails
  const { booking, event } = bookingDetails;

  const defaultPoster = "/images/posters/placeholder-poster.png";
  const posterUrl =
    event.posterImageUrl && event.posterImageUrl.startsWith("/")
      ? event.posterImageUrl
      : defaultPoster;

  return (
    <div className="max-w-2xl mx-auto my-10 relative">
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        {/* Comic book style decoration */}
        <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-400 border-2 border-black rounded-full z-10"></div>
        <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-10"></div>

        {/* Header */}
        <div className="bg-green-400 border-b-4 border-black p-4 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)`,
              backgroundSize: "6px 6px",
            }}
          ></div>
          <h1 className="text-3xl font-extrabold text-black text-center relative z-10 uppercase tracking-wider font-boldonse flex items-center justify-center">
            <Check
              className="h-8 w-8 mr-3 p-1 bg-white rounded-full border-3 border-black"
              strokeWidth={4}
            />
            Booking Confirmed!
          </h1>
        </div>

        <div className="p-6 md:p-8 relative z-10">
          {/* Poster Section */}
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-[-8px] border-4 border-black rounded-lg transform rotate-1 bg-yellow-400"></div>
              {!imageError ? (
                <Image
                  src={posterUrl}
                  alt={`${event.name} Poster`}
                  width={200}
                  height={300}
                  className="relative z-10 border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                  style={{ objectFit: "contain" }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Image
                  src={defaultPoster}
                  alt={`${event.name} Poster`}
                  width={200}
                  height={300}
                  className="relative z-10 border-3 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                  style={{ objectFit: "contain" }}
                />
              )}
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full z-20"></div>
              <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-20"></div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-blue-100 border-4 border-black rounded-xl p-4 mb-6 shadow-[5px_5px_0px_0px_rgba(0,0,0)] relative">
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
            <h2 className="text-2xl font-extrabold text-black mb-4 uppercase tracking-wide font-boldonse transform -rotate-1 inline-block bg-yellow-400 px-3 py-1 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
              {event.name}
            </h2>

            <div className="space-y-3 font-space">
              <p className="flex items-center text-black">
                <span className="bg-white border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <Calendar
                    className="h-5 w-5 text-blue-700"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="font-bold">Date:</span>
                <span className="ml-2 bg-white px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)]">
                  {new Date(event.date).toLocaleString()}
                </span>
              </p>

              <p className="flex items-center text-black">
                <span className="bg-white border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <MapPin className="h-5 w-5 text-red-600" strokeWidth={2.5} />
                </span>
                <span className="font-bold">Location:</span>
                <span className="ml-2 line-clamp-1 bg-white px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)]">
                  {event.location}
                </span>

                {event.locationUrl && (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block group ml-2"
                  >
                    <div className="bg-green-400 border-[2px] border-black rounded-lg py-0.5 px-2 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-1px] group-hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                      <ExternalLink className="h-3 w-3 mr-1" strokeWidth={3} />
                      MAP
                    </div>
                  </a>
                )}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-purple-100 border-4 border-black rounded-xl p-4 mb-6 shadow-[5px_5px_0px_0px_rgba(0,0,0)] relative">
            <div className="absolute -top-2 -left-2 h-4 w-4 bg-purple-500 border-2 border-black rounded-full"></div>

            <h3 className="text-xl font-extrabold text-black mb-3 uppercase tracking-wide font-boldonse">
              Booking Information
            </h3>

            <div className="space-y-3 font-space">
              <div>
                <p className="font-bold mb-1 flex items-center text-black">
                  <Ticket
                    className="h-4 w-4 mr-1 text-purple-700"
                    strokeWidth={2.5}
                  />
                  Seats Booked:
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats &&
                    booking.seats.map((seatId) => (
                      <span
                        key={seatId}
                        className="bg-yellow-400 text-black font-bold text-sm px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0)]"
                      >
                        {seatId}
                      </span>
                    ))}
                </div>
              </div>

              <p className="flex items-center text-black">
                <span className="bg-white border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <CreditCard
                    className="h-5 w-5 text-purple-700"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="font-bold">Payment Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0)] ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-400 text-black"
                      : "bg-orange-400 text-black"
                  }`}
                >
                  {booking.paymentStatus === "paid" ? "PAID" : "PAY AT EVENT"}
                </span>
              </p>

              <p className="flex items-center text-black">
                <span className="bg-white border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <User className="h-5 w-5 text-blue-700" strokeWidth={2.5} />
                </span>
                <span className="font-bold">Booking ID:</span>
                <span className="ml-2 font-mono bg-gray-100 px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)]">
                  {booking.id}
                </span>
              </p>

              <p className="flex items-center text-black">
                <span className="bg-white border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <Clock className="h-5 w-5 text-green-700" strokeWidth={2.5} />
                </span>
                <span className="font-bold">Booked On:</span>
                <span className="ml-2 bg-gray-100 px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)]">
                  {new Date(booking.bookingTime).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-green-100 border-4 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0)] text-center relative">
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>

            <h3 className="text-xl font-extrabold text-black mb-3 uppercase tracking-wide font-boldonse flex items-center justify-center">
              <Sparkles
                className="h-5 w-5 mr-2 text-yellow-500"
                strokeWidth={2.5}
              />
              Your QR Code Ticket
              <Sparkles
                className="h-5 w-5 ml-2 text-yellow-500"
                strokeWidth={2.5}
              />
            </h3>

            <div className="relative inline-block">
              {qrCodeDataUrl ? (
                <div className="relative inline-block">
                  <div className="border-4 border-black bg-white p-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] rounded-xl">
                    <img
                      src={qrCodeDataUrl}
                      alt="Booking QR Code"
                      className="relative z-10"
                      width="250"
                      height="250"
                    />
                  </div>
                  <div className="absolute -right-3 -bottom-3 bg-yellow-400 border-3 border-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    <Ticket className="h-6 w-6 text-black" strokeWidth={2.5} />
                  </div>
                </div>
              ) : error ? (
                <p className="text-red-600 font-bold font-space bg-red-100 border-3 border-black rounded-lg py-2 px-4 shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                  <AlertTriangle
                    className="inline h-5 w-5 mr-1 text-red-600"
                    strokeWidth={2.5}
                  />
                  Could not generate QR Code.
                </p>
              ) : (
                <LoadingSpinner size="medium" color="blue" />
              )}
            </div>

            <p className="text-sm text-black font-medium mt-3 font-space bg-white inline-block px-2 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
              Scan this code at the event
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/events")}
              className="relative inline-block group"
            >
              <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-6 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse uppercase tracking-wide flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" strokeWidth={2.5} />
                Back to Events
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
