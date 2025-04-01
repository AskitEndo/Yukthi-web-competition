"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AdminNav from "@/components/admin/AdminNav";
import EventList from "@/components/admin/EventList";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminEventsPage() {
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/admin/events");
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events);
        } else {
          setError(data.message || "Failed to load events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoadingEvents(false);
      }
    }

    if (!isLoading && user?.isAdmin) {
      fetchEvents();
    }
  }, [isLoading, user]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || isLoadingEvents) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
          <Link
            href="/admin/events/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150"
          >
            Create New Event
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search events by name or location..."
            className="w-full p-3 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
            {error}
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventList events={filteredEvents} isAdmin={true} />
        ) : (
          <div className="text-center p-8 bg-white rounded-md shadow">
            {searchTerm ? "No events match your search" : "No events found"}
          </div>
        )}
      </div>
    </div>
  );
}
