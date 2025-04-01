import Link from "next/link";
import { Event } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Pencil,
  Eye,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface EventListProps {
  events: Event[];
  isAdmin?: boolean;
}

export default function EventList({ events, isAdmin = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white border-4 border-black rounded-xl p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        ></div>
        <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>
        <p className="text-gray-700 font-bold font-space relative z-10">
          No events found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden relative">
      {/* Halftone pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }}
      ></div>

      {/* Decoration dots */}
      <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 border-2 border-black rounded-full z-10"></div>
      <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full z-10"></div>

      <table className="min-w-full divide-y-4 divide-black relative z-10">
        <thead className="bg-yellow-400">
          <tr className="border-b-4 border-black">
            <th className="px-6 py-3 text-left font-extrabold text-sm uppercase tracking-wider text-black border-r-2 border-black font-boldonse">
              <div className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" strokeWidth={3} />
                Event
              </div>
            </th>
            <th className="px-6 py-3 text-left font-extrabold text-sm uppercase tracking-wider text-black border-r-2 border-black font-boldonse">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" strokeWidth={3} />
                Date & Time
              </div>
            </th>
            <th className="px-6 py-3 text-left font-extrabold text-sm uppercase tracking-wider text-black border-r-2 border-black font-boldonse">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" strokeWidth={3} />
                Location
              </div>
            </th>
            <th className="px-6 py-3 text-center font-extrabold text-sm uppercase tracking-wider text-black font-boldonse">
              <div className="flex items-center justify-center">
                <ArrowRight className="mr-2 h-4 w-4" strokeWidth={3} />
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black bg-white">
          {events.map((event) => (
            <tr
              key={event.id}
              className="hover:bg-blue-50 transform transition-transform duration-100 hover:scale-[0.995]"
            >
              <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    <div className="absolute inset-0 border-[2px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0)] overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={
                          event.posterImageUrl ||
                          "/images/posters/placeholder-poster.png"
                        }
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/posters/placeholder-poster.png";
                        }}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-1 border-black rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-extrabold text-black font-boldonse tracking-wide uppercase">
                      {event.name}
                    </div>
                    <div className="text-xs text-gray-600 font-space">
                      {event.published ? (
                        <span className="bg-green-400 text-black px-2 py-0.5 rounded border-[1px] border-black text-[10px] font-bold">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="bg-red-400 text-black px-2 py-0.5 rounded border-[1px] border-black text-[10px] font-bold">
                          DRAFT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                <div className="text-sm font-bold text-black font-space bg-blue-100 border-2 border-black px-2 py-1 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0)] inline-block">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="text-xs font-space mt-1 bg-yellow-100 border-2 border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0)] inline-block">
                  {new Date(event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                <div className="text-sm text-black font-medium font-space bg-purple-100 border-2 border-black px-2 py-1 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0)] inline-block">
                  {event.location}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  {isAdmin ? (
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="relative inline-block group"
                    >
                      <div className="bg-blue-500 border-[2px] border-black rounded-lg py-1 px-3 text-sm font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse">
                        <span className="flex items-center">
                          <Pencil className="h-3 w-3 mr-1" strokeWidth={3} />
                          Manage
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 border-[1px] border-black rounded-full"></div>
                    </Link>
                  ) : (
                    <Link
                      href={`/events/${event.id}`}
                      className="relative inline-block group"
                    >
                      <div className="bg-blue-500 border-[2px] border-black rounded-lg py-1 px-3 text-sm font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse">
                        <span className="flex items-center">
                          <ArrowRight
                            className="h-3 w-3 mr-1"
                            strokeWidth={3}
                          />
                          View
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 border-[1px] border-black rounded-full"></div>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href={`/events/${event.id}`}
                      target="_blank"
                      className="relative inline-block group"
                    >
                      <div className="bg-gray-200 border-[2px] border-black rounded-lg py-1 px-3 text-sm font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" strokeWidth={3} />
                          Preview
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 border-[1px] border-black rounded-full"></div>
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
