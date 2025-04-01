import Link from "next/link";
import { Event } from "@/lib/types";

interface EventListProps {
  events: Event[];
  isAdmin?: boolean;
}

export default function EventList({ events, isAdmin = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No events found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
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
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {event.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isAdmin ? (
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Manage
                  </Link>
                ) : (
                  <Link
                    href={`/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href={`/events/${event.id}`}
                    className="text-gray-600 hover:text-gray-900"
                    target="_blank"
                  >
                    Preview
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
