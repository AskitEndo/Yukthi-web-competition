"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AdminNav from "@/components/admin/AdminNav";
import BookingsList from "@/components/admin/BookingsList";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminBookingsPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'paid', 'pending'
  const [eventFilter, setEventFilter] = useState("all");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all bookings
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsResponse.ok) {
          setBookings(bookingsData.bookings);
          setFilteredBookings(bookingsData.bookings);
        } else {
          setError(bookingsData.message || "Failed to load bookings");
        }

        // Fetch events for filtering
        const eventsResponse = await fetch("/api/admin/events?fields=id,name");
        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          setEvents(eventsData.events);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoadingBookings(false);
      }
    }

    if (!isLoading && user?.isAdmin) {
      fetchData();
    }
  }, [isLoading, user]);

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...bookings];

    // Apply payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === paymentFilter
      );
    }

    // Apply event filter
    if (eventFilter !== "all") {
      filtered = filtered.filter((booking) => booking.eventId === eventFilter);
    }

    // Apply search term filter (search in username, booking ID, etc.)
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, paymentFilter, eventFilter, bookings]);

  if (isLoading || isLoadingBookings) {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPaymentFilter("all");
                  setEventFilter("all");
                }}
                className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-150"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
            {error}
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <p className="mb-4 text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
            <BookingsList bookings={filteredBookings} showEventInfo={true} />
          </>
        ) : (
          <div className="text-center p-8 bg-white rounded-md shadow">
            {bookings.length > 0
              ? "No bookings match your filters"
              : "No bookings found"}
          </div>
        )}
      </div>
    </div>
  );
}
