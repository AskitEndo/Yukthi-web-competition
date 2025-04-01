"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AdminNav from "@/components/admin/AdminNav";
import LoadingSpinner from "@/components/LoadingSpinner";
import BookingsList from "@/components/admin/BookingsList";
import EditEventForm from "@/components/admin/EditEventForm";

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSeats: 0,
    bookedSeats: 0,
    totalAmount: 0,
    paymentsPending: 0,
  });

  useEffect(() => {
    async function fetchEventData() {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/admin/events/${eventId}`);
        const eventData = await eventResponse.json();

        if (eventResponse.ok) {
          setEvent(eventData.event);

          // Calculate total seats
          const totalRows = eventData.event.seats.length;
          const totalCols = eventData.event.seats[0].length;
          setStats((prev) => ({
            ...prev,
            totalSeats: totalRows * totalCols,
          }));
        } else {
          setError(eventData.message || "Failed to load event details");
          return;
        }

        // Fetch bookings for this event
        const bookingsResponse = await fetch(
          `/api/admin/events/${eventId}/bookings`
        );
        const bookingsData = await bookingsResponse.json();

        if (bookingsResponse.ok) {
          setBookings(bookingsData.bookings);

          // Calculate stats
          const bookedSeats = bookingsData.bookings.reduce(
            (total, booking) => total + booking.seats.length,
            0
          );
          const totalAmount = bookingsData.bookings.reduce(
            (total, booking) => total + booking.totalPrice,
            0
          );
          const pendingPayments = bookingsData.bookings
            .filter((booking) => booking.paymentStatus === "pending")
            .reduce((total, booking) => total + booking.totalPrice, 0);

          setStats((prev) => ({
            ...prev,
            bookedSeats,
            totalAmount,
            paymentsPending: pendingPayments,
          }));
        } else {
          setError(bookingsData.message || "Failed to load booking details");
        }
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoadingData(false);
      }
    }

    if (!isLoading && user?.isAdmin) {
      fetchEventData();
    }
  }, [isLoading, user, eventId]);

  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/events");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("An unexpected error occurred");
    }
  };

  if (isLoading || isLoadingData) {
    return <LoadingSpinner />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-4">
          You do not have permission to access the admin area.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
            {error}
          </div>
          <Link href="/admin/events" className="text-blue-600 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center p-8 bg-white rounded-md shadow">
            Event not found
          </div>
          <div className="mt-4">
            <Link
              href="/admin/events"
              className="text-blue-600 hover:underline"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/events"
              className="text-blue-600 hover:underline"
            >
              Back to Events
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
          </div>
          <div className="space-x-2">
            {!isEditMode && (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150"
                >
                  Edit Event
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-150"
                >
                  Delete Event
                </button>
              </>
            )}
            {isEditMode && (
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-150"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {isEditMode ? (
          <EditEventForm
            event={event}
            onSaved={(updatedEvent) => {
              setEvent(updatedEvent);
              setIsEditMode(false);
            }}
            onCancel={() => setIsEditMode(false)}
          />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-6">
                  {event.posterImageUrl ? (
                    <div className="relative aspect-[2/3] w-full h-64 md:h-96">
                      <Image
                        src={event.posterImageUrl}
                        alt={event.name}
                        fill
                        className="object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/posters/placeholder-poster.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 w-full h-64 md:h-96 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">No poster image</span>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
                  <p className="text-gray-600 mb-6">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Date & Time
                      </h3>
                      <p>{new Date(event.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Location</h3>
                      <p>{event.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Total Seats
                      </h3>
                      <p>{stats.totalSeats}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Seats Booked
                      </h3>
                      <p>
                        {stats.bookedSeats} (
                        {Math.round(
                          (stats.bookedSeats / stats.totalSeats) * 100
                        )}
                        %)
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Total Revenue
                      </h3>
                      <p>${stats.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Pending Payments
                      </h3>
                      <p>${stats.paymentsPending.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/events/${event.id}`}
                      target="_blank"
                      className="text-blue-600 hover:underline mr-4"
                    >
                      View Public Page
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/seating`}
                      className="text-blue-600 hover:underline"
                    >
                      View Seating Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Bookings ({bookings.length})
              </h2>
              {bookings.length > 0 ? (
                <BookingsList bookings={bookings} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                  No bookings have been made for this event yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
