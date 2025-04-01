// app/page.tsx

import { getEvents } from "@/lib/data-utils";
import EventCard from "@/components/EventCard";
import {
  CalendarDays,
  Search,
  Filter,
  Star,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="relative">
      {/* Hero Section with Comic Book Styling */}
      <div className="relative overflow-hidden mb-16">
        {/* Background with halftone pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90 z-0"></div>

        {/* Comic-style border frame around hero section */}
        <div className="absolute top-6 left-6 right-6 bottom-6 border-[6px] border-black rounded-xl z-0 shadow-[8px_8px_0px_0px_rgba(0,0,0)]"></div>

        {/* Pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Comic book style decorative elements */}
        <div className="absolute top-10 right-10 h-16 w-16 bg-yellow-400 border-4 border-black rounded-full z-10 transform rotate-12 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-black" strokeWidth={3} />
        </div>
        <div className="absolute bottom-20 left-10 h-14 w-14 bg-red-500 border-4 border-black rounded-full z-10 transform -rotate-6 flex items-center justify-center">
          <Zap className="h-7 w-7 text-white" strokeWidth={3} />
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-6 py-24 z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 border-3 border-black text-black mb-6 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform rotate-2 font-boldonse">
            <Star className="h-4 w-4 mr-2 text-black" strokeWidth={3} />
            Discover amazing events in your area
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 font-boldonse tracking-wider uppercase">
            Find & Book{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-yellow-300">
                Amazing Events
              </span>
              <span className="absolute -bottom-2 -left-2 w-full h-8 bg-black -z-0 transform -rotate-2"></span>
            </span>
          </h1>

          <p className="text-xl text-white max-w-2xl mx-auto mb-10 font-space">
            Discover local events, book tickets, and create memories that will
            last a lifetime.
          </p>

          {/* Search box */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] font-space"
              />
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
            </div>
            <button className="relative bg-blue-500 border-4 border-black text-white px-8 py-4 rounded-lg font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all transform hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] flex items-center justify-center font-boldonse uppercase tracking-wide">
              <Filter className="h-5 w-5 mr-2" strokeWidth={3} />
              Filter Events
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
            </button>
          </div>

          {/* Featured categories section */}
          <div className="max-w-7xl mx-auto px-6 mt-20 mb-16">
            <div className="relative inline-block mb-8">
              <h2 className="text-2xl font-extrabold text-black uppercase tracking-wide font-boldonse relative z-10">
                Browse by Category
              </h2>
              <div className="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400 -z-10"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Music", "Sports", "Arts", "Food", "Tech", "Business"].map(
                (category, index) => (
                  <a
                    key={category}
                    href={`/events?category=${category.toLowerCase()}`}
                    className="relative group"
                  >
                    <div className="bg-white border-4 border-black rounded-xl py-6 px-2 text-center transition-all duration-300 transform group-hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0)] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)]">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-3 mx-auto border-3 border-black">
                        <span className="font-extrabold text-xl font-boldonse">
                          {category.charAt(0)}
                        </span>
                      </div>
                      <p className="font-bold text-black font-space">
                        {category}
                      </p>
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 h-4 w-4 bg-${
                        ["red", "blue", "green", "yellow", "purple", "pink"][
                          index % 6
                        ]
                      }-500 border-2 border-black rounded-full`}
                    ></div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Comic style wave bottom border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 text-white"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
          {/* Comic style zigzag border overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 bg-black z-10"
            style={{
              clipPath:
                "polygon(0% 100%, 4% 0%, 8% 100%, 12% 0%, 16% 100%, 20% 0%, 24% 100%, 28% 0%, 32% 100%, 36% 0%, 40% 100%, 44% 0%, 48% 100%, 52% 0%, 56% 100%, 60% 0%, 64% 100%, 68% 0%, 72% 100%, 76% 0%, 80% 100%, 84% 0%, 88% 100%, 92% 0%, 96% 100%, 100% 0%, 100% 100%)",
            }}
          ></div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-yellow-400 text-black text-sm font-bold mb-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] rotate-1 font-space">
              <CalendarDays className="h-4 w-4 mr-2" strokeWidth={3} />
              Latest Events
            </div>
            <h2 className="text-3xl font-extrabold text-black uppercase tracking-wider font-boldonse">
              Trending Now
            </h2>
          </div>
          <a href="/events" className="relative group inline-block">
            <div className="bg-blue-500 border-3 border-black rounded-lg py-2 px-4 text-white font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)] font-space flex items-center">
              See More
              <ArrowRight className="h-4 w-4 ml-1" strokeWidth={3} />
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
          </a>
        </div>

        {events.length === 0 ? (
          <div className="bg-white border-4 border-black p-10 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0)] text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
                backgroundSize: "10px 10px",
              }}
            ></div>
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 h-5 w-5 bg-blue-500 border-2 border-black rounded-full"></div>

            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
              <CalendarDays className="h-8 w-8 text-blue-600" strokeWidth={3} />
            </div>
            <p className="text-xl text-black font-bold font-boldonse relative z-10 uppercase">
              No events scheduled yet. Check back soon!
            </p>
            <p className="text-gray-700 mt-2 font-space">
              We're working on bringing amazing events to you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Comic book style footer decoration */}
      <div className="w-full h-12 bg-black relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-6"
          style={{
            clipPath:
              "polygon(0% 0%, 4% 100%, 8% 0%, 12% 100%, 16% 0%, 20% 100%, 24% 0%, 28% 100%, 32% 0%, 36% 100%, 40% 0%, 44% 100%, 48% 0%, 52% 100%, 56% 0%, 60% 100%, 64% 0%, 68% 100%, 72% 0%, 76% 100%, 80% 0%, 84% 100%, 88% 0%, 92% 100%, 96% 0%, 100% 100%, 100% 0%)",
            background: "white",
          }}
        ></div>
      </div>
    </div>
  );
}
