"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Check,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  Ticket,
  User,
} from "lucide-react";

// Define proper interfaces
interface Booking {
  id: string;
  eventId: string;
  eventName?: string;
  userId: string;
  userName?: string;
  seats: string[];
  bookingTime: string;
  paymentStatus: string;
  amount?: number;
}

interface BookingsListProps {
  bookings: Booking[];
  showEventInfo?: boolean;
}

export default function BookingsList({
  bookings,
  showEventInfo = false,
}: BookingsListProps) {
  const [sortField, setSortField] = useState<string>("bookingTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Safe sort function that handles missing properties
  const sortedBookings = [...bookings].sort((a, b) => {
    // Handle missing properties safely
    const aValue = a[sortField as keyof Booking] || "";
    const bValue = b[sortField as keyof Booking] || "";

    // Basic sort for different types
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // Handle other types or convert to string for comparison
      const aString = String(aValue);
      const bString = String(bValue);
      return sortOrder === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    }
  });

  // Helper function to render payment status with appropriate styling
  const renderPaymentStatus = (status: string) => {
    let bgColor = "bg-yellow-400";
    let textColor = "text-black";
    let label = "Pending";

    if (status === "paid") {
      bgColor = "bg-green-400";
      textColor = "text-black";
      label = "Paid";
    } else if (status === "pay_at_event") {
      bgColor = "bg-blue-400";
      textColor = "text-black";
      label = "Pay at Event";
    }

    return (
      <span
        className={`${bgColor} ${textColor} px-2 py-1 rounded-lg text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse uppercase`}
      >
        <CreditCard className="h-3 w-3 inline-block mr-1" strokeWidth={3} />
        {label}
      </span>
    );
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  // Handle empty bookings
  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 font-space">No bookings to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-4 border-black">
            <th className="p-3 text-left">
              <button
                onClick={() => toggleSort("id")}
                className="flex items-center font-boldonse text-sm uppercase"
              >
                Booking ID
                <ArrowUpDown className="h-3 w-3 ml-1" strokeWidth={3} />
              </button>
            </th>
            {showEventInfo && (
              <th className="p-3 text-left">
                <button
                  onClick={() => toggleSort("eventName")}
                  className="flex items-center font-boldonse text-sm uppercase"
                >
                  Event
                  <ArrowUpDown className="h-3 w-3 ml-1" strokeWidth={3} />
                </button>
              </th>
            )}
            <th className="p-3 text-left">
              <button
                onClick={() => toggleSort("userName")}
                className="flex items-center font-boldonse text-sm uppercase"
              >
                User
                <ArrowUpDown className="h-3 w-3 ml-1" strokeWidth={3} />
              </button>
            </th>
            <th className="p-3 text-left">
              <button
                onClick={() => toggleSort("bookingTime")}
                className="flex items-center font-boldonse text-sm uppercase"
              >
                Date
                <ArrowUpDown className="h-3 w-3 ml-1" strokeWidth={3} />
              </button>
            </th>
            <th className="p-3 text-left">
              <span className="font-boldonse text-sm uppercase">Seats</span>
            </th>
            <th className="p-3 text-left">
              <button
                onClick={() => toggleSort("paymentStatus")}
                className="flex items-center font-boldonse text-sm uppercase"
              >
                Status
                <ArrowUpDown className="h-3 w-3 ml-1" strokeWidth={3} />
              </button>
            </th>
            <th className="p-3 text-center">
              <span className="font-boldonse text-sm uppercase">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b-2 border-gray-200 hover:bg-gray-50"
            >
              <td className="p-3 font-mono text-xs font-bold">
                {booking.id.substring(0, 8)}...
              </td>
              {showEventInfo && (
                <td className="p-3">
                  <Link
                    href={`/events/${booking.eventId}`}
                    className="relative inline-block group"
                  >
                    <div className="font-space text-sm font-bold text-blue-700 flex items-center">
                      <span className="border-b border-blue-700">
                        {booking.eventName || "Unknown Event"}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100" />
                    </div>
                  </Link>
                </td>
              )}
              <td className="p-3">
                <div className="flex items-center">
                  <span className="bg-blue-100 border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    <User className="h-3 w-3 text-blue-700" strokeWidth={3} />
                  </span>
                  <span className="font-space text-sm font-medium">
                    {booking.userName || "Unknown User"}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <span className="bg-purple-100 border-2 border-black rounded-lg p-1 mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    <Clock
                      className="h-3 w-3 text-purple-700"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="font-space text-xs">
                    {formatDate(booking.bookingTime)}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {booking.seats && booking.seats.length > 0 ? (
                    booking.seats.slice(0, 3).map((seat, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-xs px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)] font-bold flex items-center font-space"
                      >
                        <Ticket
                          className="h-2 w-2 mr-1 text-green-700"
                          strokeWidth={3}
                        />
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No seats</span>
                  )}
                  {booking.seats && booking.seats.length > 3 && (
                    <span className="bg-gray-100 text-xs px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)] font-bold font-space">
                      +{booking.seats.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                {renderPaymentStatus(booking.paymentStatus)}
              </td>
              <td className="p-3 text-center">
                <Link
                  href={`/booking/${booking.id}`}
                  className="relative inline-block group"
                >
                  <div className="bg-purple-500 border-[2px] border-black rounded-lg py-1 px-3 text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-1px] group-hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] font-boldonse text-xs uppercase flex items-center">
                    <Eye className="h-3 w-3 mr-1" strokeWidth={3} />
                    View
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
