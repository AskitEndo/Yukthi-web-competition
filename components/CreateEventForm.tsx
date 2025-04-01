// components/admin/CreateEventForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Music,
  Calendar,
  MapPin,
  Image,
  Grid,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

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
    <div className="max-w-4xl mx-auto mt-8">
      {/* Comic book style form container */}
      <div className="relative bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
        {/* Header strip */}
        <div className="bg-yellow-400 py-3 px-6 border-b-4 border-black relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-black uppercase tracking-wider font-boldonse flex items-center">
              <Music strokeWidth={3} className="mr-2 h-6 w-6" />
              CREATE NEW EVENT
            </h2>
            <div className="h-8 w-8 bg-red-500 border-[3px] border-black rounded-full"></div>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6 relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>

          {/* Alert messages */}
          {error && (
            <div className="mb-6 relative">
              <div className="bg-red-100 border-[3px] border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <div className="flex items-center">
                  <AlertTriangle
                    className="h-5 w-5 text-red-600 mr-2"
                    strokeWidth={3}
                  />
                  <p className="text-red-700 font-bold font-space">{error}</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            </div>
          )}

          {success && (
            <div className="mb-6 relative">
              <div className="bg-green-100 border-[3px] border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                <div className="flex items-center">
                  <CheckCircle
                    className="h-5 w-5 text-green-600 mr-2"
                    strokeWidth={3}
                  />
                  <p className="text-green-700 font-bold font-space">
                    {success}
                  </p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Basic Input Fields */}
            <div className="relative group">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
              >
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>

            <div className="relative group">
              <label
                htmlFor="description"
                className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
              ></textarea>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label
                  htmlFor="date"
                  className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                >
                  <Calendar
                    className="h-4 w-4 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  Date and Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="location"
                  className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                >
                  <MapPin
                    className="h-4 w-4 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="locationUrl"
                className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
              >
                Location URL (Optional)
              </label>
              <input
                type="url"
                name="locationUrl"
                id="locationUrl"
                value={formData.locationUrl}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label
                  htmlFor="posterImageUrl"
                  className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                >
                  <Image
                    className="h-4 w-4 mr-1 inline-block"
                    strokeWidth={3}
                  />
                  Poster Image URL <span className="text-red-500">*</span>
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
                  className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="bannerImageUrl"
                  className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
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
                  className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Seating Layout */}
            <div className="mt-6 mb-2">
              <div className="bg-blue-400 py-2 px-4 border-[3px] border-black rounded-lg relative mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                <h3 className="font-bold text-black font-boldonse flex items-center">
                  <Grid className="h-4 w-4 mr-2" strokeWidth={3} />
                  SEATING LAYOUT
                </h3>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="relative group">
                  <label
                    htmlFor="rows"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
                  >
                    Number of Rows <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>

                <div className="relative group">
                  <label
                    htmlFor="cols"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
                  >
                    Number of Columns <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 relative group">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 border-[3px] border-black rounded-lg font-extrabold text-white uppercase tracking-wide font-boldonse shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] ${
                  isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-500"
                } focus:outline-none`}
              >
                <div className="flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2" strokeWidth={3} />
                  {isLoading ? "CREATING..." : "CREATE EVENT!"}
                </div>
              </button>
              <div className="absolute -top-1 -left-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
