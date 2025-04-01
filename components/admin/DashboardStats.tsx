import { Calendar, ShoppingBag, Clock, DollarSign, Zap } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalEvents: number;
    totalBookings: number;
    recentBookings: number;
    revenue: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Events Card */}
      <div className="relative transform transition-all duration-300 hover:-translate-y-2">
        <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {/* Card Header */}
          <div className="bg-blue-400 py-2 px-4 border-b-4 border-black relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: "6px 6px",
              }}
            ></div>
            <h3 className="font-extrabold text-black uppercase tracking-wider font-boldonse text-center">
              EVENTS
            </h3>
          </div>

          {/* Card Content */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 font-space">
                Total Count
              </p>
              <p className="text-3xl font-bold text-black font-boldonse">
                {stats.totalEvents}
              </p>
            </div>
            <div className="relative">
              <div className="bg-blue-100 p-3 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                <Calendar className="h-6 w-6 text-blue-700" strokeWidth={3} />
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </div>
          </div>

          {/* Comic style decoration */}
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>
        </div>
      </div>

      {/* Total Bookings Card */}
      <div className="relative transform transition-all duration-300 hover:-translate-y-2">
        <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {/* Card Header */}
          <div className="bg-green-400 py-2 px-4 border-b-4 border-black relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: "6px 6px",
              }}
            ></div>
            <h3 className="font-extrabold text-black uppercase tracking-wider font-boldonse text-center">
              BOOKINGS
            </h3>
          </div>

          {/* Card Content */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 font-space">
                Total Count
              </p>
              <p className="text-3xl font-bold text-black font-boldonse">
                {stats.totalBookings}
              </p>
            </div>
            <div className="relative">
              <div className="bg-green-100 p-3 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                <ShoppingBag
                  className="h-6 w-6 text-green-700"
                  strokeWidth={3}
                />
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            </div>
          </div>

          {/* Comic style decoration */}
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-green-500 border-2 border-black rounded-full"></div>
        </div>
      </div>

      {/* Recent Bookings Card */}
      <div className="relative transform transition-all duration-300 hover:-translate-y-2">
        <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {/* Card Header */}
          <div className="bg-purple-400 py-2 px-4 border-b-4 border-black relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: "6px 6px",
              }}
            ></div>
            <h3 className="font-extrabold text-black uppercase tracking-wider font-boldonse text-center">
              RECENT
            </h3>
          </div>

          {/* Card Content */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 font-space">
                New Bookings
              </p>
              <p className="text-3xl font-bold text-black font-boldonse">
                {stats.recentBookings}
              </p>
            </div>
            <div className="relative">
              <div className="bg-purple-100 p-3 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                <Clock className="h-6 w-6 text-purple-700" strokeWidth={3} />
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-blue-400 border-2 border-black rounded-full"></div>
            </div>
          </div>

          {/* Comic style decoration */}
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-purple-500 border-2 border-black rounded-full"></div>

          {/* ZAP decoration */}
          {stats.recentBookings > 0 && (
            <div className="absolute -top-3 -right-3 transform rotate-12">
              <div className="bg-yellow-400 px-2 py-1 rounded-lg border-2 border-black font-boldonse text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                <Zap className="h-3 w-3 inline-block mr-1" strokeWidth={3} />
                NEW!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Card */}
      <div className="relative transform transition-all duration-300 hover:-translate-y-2">
        <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {/* Card Header */}
          <div className="bg-yellow-400 py-2 px-4 border-b-4 border-black relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: "6px 6px",
              }}
            ></div>
            <h3 className="font-extrabold text-black uppercase tracking-wider font-boldonse text-center">
              REVENUE
            </h3>
          </div>

          {/* Card Content */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 font-space">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-black font-boldonse">
                ${stats.revenue.toFixed(2)}
              </p>
            </div>
            <div className="relative">
              <div className="bg-yellow-100 p-3 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                <DollarSign
                  className="h-6 w-6 text-yellow-700"
                  strokeWidth={3}
                />
              </div>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
          </div>

          {/* Comic style decoration */}
          <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-yellow-500 border-2 border-black rounded-full"></div>

          {/* Money badge for high revenue */}
          {stats.revenue > 100 && (
            <div className="absolute top-2 -left-2 transform -rotate-12">
              <div className="bg-green-400 px-2 py-1 rounded-full border-2 border-black font-boldonse text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                CASH IN!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
