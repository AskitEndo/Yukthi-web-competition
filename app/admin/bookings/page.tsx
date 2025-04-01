"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AdminNav from "@/components/admin/AdminNav";
import BookingsList from "@/components/admin/BookingsList";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Filter,
  Search,
  X,
  AlertTriangle,
  Home,
  RefreshCw,
  Calendar,
  CreditCard,
  Users,
  Database,
  Plus,
} from "lucide-react";

// Define the booking type properly to avoid access issues
interface Booking {
  id: string;
  eventId: string;
  eventName?: string;
  userId: string;
  userName?: string; // Optional as it might come from a join
  user?: { username: string }; // Alternative structure
  seats: string[];
  bookingTime: string;
  paymentStatus: string;
  amount?: number;
}

interface Event {
  id: string;
  name: string;
}

export default function AdminBookingsPage() {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'paid', 'pending'
  const [eventFilter, setEventFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all bookings
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsResponse.ok) {
          // Normalize booking data to ensure consistent property access
          const normalizedBookings = bookingsData.bookings.map(
            (booking: any) => ({
              ...booking,
              // Ensure userName exists, derive from user.username if needed
              userName:
                booking.userName ||
                (booking.user && booking.user.username) ||
                "Unknown User",
              // Ensure eventName exists
              eventName: booking.eventName || "Unknown Event",
              // Normalize payment status to handle different formats
              paymentStatus: booking.paymentStatus || "pending",
            })
          );

          setBookings(normalizedBookings);
          setFilteredBookings(normalizedBookings);
        } else {
          setError(bookingsData.message || "Failed to load bookings");
        }

        // Fetch events for filtering
        const eventsResponse = await fetch("/api/admin/events?fields=id,name");
        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          setEvents(eventsData.events || []);
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
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(searchTermLower) ||
          (booking.userName &&
            booking.userName.toLowerCase().includes(searchTermLower)) ||
          (booking.eventName &&
            booking.eventName.toLowerCase().includes(searchTermLower))
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, paymentFilter, eventFilter, bookings]);

  if (isLoading || isLoadingBookings) {
    return <LoadingSpinner />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden max-w-md mx-auto">
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

          <h1 className="text-2xl font-extrabold text-red-700 text-center mb-2 uppercase tracking-wide font-boldonse">
            ACCESS DENIED!
          </h1>
          <p className="text-center text-red-700 font-bold relative z-10 font-space mb-6">
            You do not have permission to access the admin area.
          </p>

          <Link href="/" className="relative inline-block group">
            <div className="bg-blue-500 border-[3px] border-black rounded-lg py-2 px-4 text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
              <Home className="h-4 w-4 mr-2" strokeWidth={3} />
              Return to Homepage
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 relative">
          <h1 className="text-3xl font-extrabold text-black uppercase relative z-10 inline-block font-boldonse tracking-wide">
            Manage Bookings
            <div className="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400 -z-10"></div>
          </h1>
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full"></div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-4 border-black rounded-xl p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "8px 8px",
            }}
          ></div>

          <div className="absolute -top-2 -right-2 h-5 w-5 bg-purple-500 border-2 border-black rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

          <h2 className="text-xl font-extrabold text-black mb-4 uppercase tracking-wide relative z-10 font-boldonse flex items-center">
            <Filter className="h-5 w-5 mr-2" strokeWidth={3} />
            Filter Bookings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <div>
              <label className="block text-sm font-bold text-black mb-2 font-boldonse uppercase">
                <Search className="h-4 w-4 inline-block mr-1" strokeWidth={3} />
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full p-3 border-3 border-black rounded-lg font-space shadow-[3px_3px_0px_0px_rgba(0,0,0)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2 font-boldonse uppercase">
                <CreditCard
                  className="h-4 w-4 inline-block mr-1"
                  strokeWidth={3}
                />
                Payment Status
              </label>
              <select
                className="w-full p-3 border-3 border-black rounded-lg font-space shadow-[3px_3px_0px_0px_rgba(0,0,0)] appearance-none bg-white"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="pay_at_event">Pay at Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2 font-boldonse uppercase">
                <Calendar
                  className="h-4 w-4 inline-block mr-1"
                  strokeWidth={3}
                />
                Event
              </label>
              <select
                className="w-full p-3 border-3 border-black rounded-lg font-space shadow-[3px_3px_0px_0px_rgba(0,0,0)] appearance-none bg-white"
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
                className="relative w-full p-3 bg-blue-500 text-white border-3 border-black rounded-lg font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transition duration-150 transform hover:translate-y-[-2px] hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-boldonse uppercase flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" strokeWidth={3} />
                Clear Filters
                <div className="absolute -top-2 -right-2 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 border-4 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative overflow-hidden mb-6">
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
            <p className="flex items-center justify-center font-bold text-red-700 font-space">
              <AlertTriangle className="h-5 w-5 mr-2" strokeWidth={3} />
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 mx-auto flex items-center justify-center bg-blue-500 text-white border-2 border-black rounded-lg px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition duration-150 transform hover:translate-y-[-2px] hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse"
            >
              <RefreshCw className="h-4 w-4 mr-2" strokeWidth={3} />
              Retry
            </button>
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <div className="bg-yellow-100 border-3 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0)] mb-6 relative">
              <div className="absolute -top-2 -left-2 h-4 w-4 bg-yellow-500 border-2 border-black rounded-full"></div>
              <p className="font-bold text-black font-space flex items-center">
                <Database
                  className="h-4 w-4 mr-2 text-yellow-700"
                  strokeWidth={3}
                />
                Showing{" "}
                <span className="mx-1 bg-yellow-300 px-2 py-0.5 border-2 border-black rounded-lg">
                  {filteredBookings.length}
                </span>{" "}
                of{" "}
                <span className="mx-1 bg-yellow-300 px-2 py-0.5 border-2 border-black rounded-lg">
                  {bookings.length}
                </span>{" "}
                bookings
              </p>
            </div>
            <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative">
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-500 border-2 border-black rounded-full"></div>
              <BookingsList bookings={filteredBookings} showEventInfo={true} />
            </div>
          </>
        ) : (
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
              <Users className="h-8 w-8 text-blue-600" strokeWidth={3} />
            </div>

            <p className="text-xl text-black font-bold font-boldonse relative z-10 uppercase">
              {bookings.length > 0
                ? "No bookings match your filters"
                : "No bookings found in the system"}
            </p>

            {bookings.length === 0 && (
              <Link
                href="/events"
                className="mt-4 inline-flex items-center justify-center bg-green-500 text-white border-3 border-black rounded-lg px-5 py-2 font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transition duration-150 transform hover:translate-y-[-2px] hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-boldonse"
              >
                <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
                Create First Booking
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
