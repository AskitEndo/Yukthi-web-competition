// components/admin/CreateEventForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "", // Will use datetime-local input
    location: "",
    locationUrl: "",
    posterImageUrl: "",
    bannerImageUrl: "",
    rows: "",
    cols: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Convert local datetime string to ISO string for consistency
    let isoDateString = "";
    try {
      if (formData.date) {
        isoDateString = new Date(formData.date).toISOString();
      } else {
        throw new Error("Date is required.");
      }
    } catch (dateError) {
      setError("Invalid date/time format selected.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: isoDateString, // Send ISO string to backend
          rows: parseInt(formData.rows, 10), // Ensure numbers are sent
          cols: parseInt(formData.cols, 10),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Event "${data.event.name}" created successfully!`);
        // Reset form
        setFormData({
          name: "",
          description: "",
          date: "",
          location: "",
          locationUrl: "",
          posterImageUrl: "",
          bannerImageUrl: "",
          rows: "",
          cols: "",
        });
        // Optional: Redirect or refresh data display on admin page
        // router.refresh(); // Or navigate to event list/detail
      } else {
        setError(data.message || "Failed to create event.");
      }
    } catch (err) {
      console.error("Create event fetch error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-5 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 border border-green-400 rounded">
            {success}
          </div>
        )}

        {/* Basic Input Fields */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date and Time
          </label>
          <input
            type="datetime-local"
            name="date"
            id="date"
            required
            value={formData.date}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location (Venue Name/Address)
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            value={formData.location}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="locationUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Location URL (Optional Google Maps etc.)
          </label>
          <input
            type="url"
            name="locationUrl"
            id="locationUrl"
            value={formData.locationUrl}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="posterImageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Poster Image URL (e.g., /images/posters/event.png)
          </label>
          <input
            type="text"
            name="posterImageUrl"
            id="posterImageUrl"
            required
            value={formData.posterImageUrl}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="/images/posters/your-image.png"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="bannerImageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Banner Image URL (Optional)
          </label>
          <input
            type="text"
            name="bannerImageUrl"
            id="bannerImageUrl"
            value={formData.bannerImageUrl}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="/images/banners/your-banner.png"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Seating Layout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="rows"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Rows
            </label>
            <input
              type="number"
              name="rows"
              id="rows"
              required
              min="1"
              max="50"
              value={formData.rows}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="cols"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Columns
            </label>
            <input
              type="number"
              name="cols"
              id="cols"
              required
              min="1"
              max="50"
              value={formData.cols}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150`}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
