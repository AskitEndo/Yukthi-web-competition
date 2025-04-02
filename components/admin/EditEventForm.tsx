import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  Users,
  IndianRupee,
  Tag,
  Eye,
  ArrowLeft,
  Save,
  Sparkles,
} from "lucide-react";

interface EventFormData {
  id?: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  category: string;
  posterImageUrl?: string;
  published: boolean;
}

interface EditEventFormProps {
  event?: EventFormData;
  isNew?: boolean;
}

export default function EditEventForm({
  event,
  isNew = false,
}: EditEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    time: "19:00",
    location: "",
    capacity: 100,
    price: 0,
    category: "general",
    published: false,
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      const dateObj = new Date(event.date);
      setFormData({
        ...event,
        date: dateObj.toISOString().split("T")[0],
        time: dateObj.toTimeString().substring(0, 5),
      });

      if (event.posterImageUrl) {
        setPosterPreview(event.posterImageUrl);
      }
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else if (name === "capacity" || name === "price") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPosterFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPoster = async (): Promise<string | null> => {
    if (!posterFile) return formData.posterImageUrl || null;

    try {
      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append("file", posterFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload poster image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading poster:", error);
      toast.error("Failed to upload poster image");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time
      const dateTimeString = `${formData.date}T${formData.time}:00`;

      // Upload poster if there is one
      const posterUrl = await uploadPoster();

      // Extract time from formData and keep the rest
      const { time, ...restFormData } = formData;

      // Create the event data object without the time property
      const eventData = {
        ...restFormData,
        date: new Date(dateTimeString).toISOString(),
        posterImageUrl: posterUrl,
      };

      // API endpoint and method based on whether it's a new event or an edit
      const endpoint = isNew
        ? "/api/admin/events"
        : `/api/admin/events/${event?.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      toast.success(
        isNew ? "Event created successfully!" : "Event updated successfully!"
      );

      // Redirect to the events list or the event detail page
      if (isNew) {
        const data = await response.json();
        router.push(`/admin/events/${data.id}`);
      } else {
        router.push(`/admin/events`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Comic book style container */}
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
              <Sparkles strokeWidth={3} className="mr-2 h-6 w-6" />
              {isNew ? "CREATE NEW EVENT" : "EDIT EVENT"}
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

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                {/* Event Title */}
                <div className="relative group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
                  >
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>

                {/* Description */}
                <div className="relative group">
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                  ></textarea>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label
                      htmlFor="date"
                      className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                    >
                      <Calendar className="h-4 w-4 mr-1" strokeWidth={3} />
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="relative group">
                    <label
                      htmlFor="time"
                      className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-1" strokeWidth={3} />
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* Location */}
                <div className="relative group">
                  <label
                    htmlFor="location"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1" strokeWidth={3} />
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Event Poster */}
                <div className="relative">
                  <label
                    htmlFor="poster"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-1" strokeWidth={3} />
                    Event Poster
                  </label>

                  <div className="mt-2 flex items-center">
                    <div className="relative flex-shrink-0 h-40 w-40 bg-gray-100 border-[3px] border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      {posterPreview ? (
                        <img
                          src={posterPreview}
                          alt="Event poster preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 font-boldonse">
                          No image
                        </div>
                      )}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.4) 1px, transparent 1px)`,
                          backgroundSize: "4px 4px",
                        }}
                      ></div>
                    </div>

                    <div className="ml-5 relative group">
                      <label
                        htmlFor="poster-upload"
                        className="cursor-pointer bg-blue-400 py-2 px-3 border-[3px] border-black rounded-lg text-sm font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-y-[-2px] hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all inline-block font-boldonse"
                      >
                        <span className="flex items-center">
                          <Upload className="h-4 w-4 mr-1" strokeWidth={3} />
                          Upload poster
                        </span>
                        <input
                          id="poster-upload"
                          name="poster"
                          type="file"
                          accept="image/*"
                          onChange={handlePosterChange}
                          className="sr-only"
                        />
                      </label>
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="relative group">
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                    >
                      <Users className="h-4 w-4 mr-1" strokeWidth={3} />
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      min="1"
                      required
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="relative group">
                    <label
                      htmlFor="price"
                      className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                    >
                      <IndianRupee className="h-4 w-4 mr-1" strokeWidth={3} />
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* Category */}
                <div className="relative group">
                  <label
                    htmlFor="category"
                    className="block text-sm font-bold text-black mb-1 uppercase font-boldonse flex items-center"
                  >
                    <Tag className="h-4 w-4 mr-1" strokeWidth={3} />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="general">General</option>
                    <option value="concert">Concert</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="sports">Sports</option>
                    <option value="comedy">Comedy</option>
                    <option value="theater">Theater</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>

                {/* Published checkbox */}
                <div className="relative mt-6 border-[3px] border-black rounded-lg p-3 bg-yellow-100 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <div className="flex items-center">
                    <div className="relative h-6 w-6">
                      <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 border-[3px] border-black rounded transition-colors ${
                          formData.published ? "bg-green-400" : "bg-white"
                        }`}
                      ></div>
                      {formData.published && (
                        <svg
                          className="absolute inset-0 h-full w-full text-black stroke-[3px]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <label
                      htmlFor="published"
                      className="ml-3 block text-sm font-bold text-black uppercase font-boldonse flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" strokeWidth={3} />
                      Publish event
                    </label>
                  </div>
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="relative py-3 px-6 border-[3px] border-black rounded-lg font-extrabold text-black uppercase tracking-wide font-boldonse shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] bg-white hover:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-2" strokeWidth={3} />
                  Cancel
                </div>
                <div className="absolute -top-2 -left-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className={`relative py-3 px-6 border-[3px] border-black rounded-lg font-extrabold text-white uppercase tracking-wide font-boldonse shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                } focus:outline-none`}
              >
                <div className="flex items-center">
                  <Save className="h-5 w-5 mr-2" strokeWidth={3} />
                  {isLoading
                    ? "Saving..."
                    : isNew
                    ? "Create Event!"
                    : "Update Event!"}
                </div>
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
