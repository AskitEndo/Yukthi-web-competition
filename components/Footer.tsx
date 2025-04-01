// components/Footer.tsx
"use client";

import {
  Calendar,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Heart,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16">
      {/* Comic book style top border */}
      <div className="h-8 bg-red-500 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        ></div>

        {/* Zig-zag pattern on top */}
        <div
          className="absolute -top-6 left-0 right-0 h-6 bg-yellow-400"
          style={{
            clipPath:
              "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)",
          }}
        ></div>
      </div>

      {/* Main footer content with comic style */}
      <div className="relative bg-blue-600 border-t-4 border-b-4 border-black overflow-hidden">
        {/* Halftone pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        ></div>

        {/* Comic bubbles scattered in background */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full border-4 border-black opacity-20 transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-red-500 rounded-full border-4 border-black opacity-10 transform -rotate-6"></div>
        <div className="absolute bottom-30 left-1/4 w-16 h-16 bg-green-400 rounded-full border-4 border-black opacity-15 transform rotate-45"></div>

        <div className="container mx-auto py-12 px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1 */}
            <div>
              <div className="bg-yellow-400 border-4 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform rotate-1 relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-[3px] border-black rounded-full"></div>
                <h3 className="text-xl font-extrabold text-black mb-4 uppercase tracking-wider flex items-center font-boldonse">
                  <Zap className="mr-2 h-5 w-5" strokeWidth={3} />
                  About SeeVent
                </h3>
                <p className="text-black font-bold mb-4 font-space">
                  Discover amazing events happening around you. Book tickets
                  effortlessly and make memories that last forever.
                </p>
                <div className="flex space-x-3 mt-4">
                  <a
                    href="https://instagram.com"
                    className="relative group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-blue-500 border-[3px] border-black p-2 rounded-full transform transition-transform group-hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      <Instagram
                        className="h-5 w-5 text-white"
                        strokeWidth={3}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full"></div>
                  </a>
                  <a
                    href="https://twitter.com"
                    className="relative group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-red-500 border-[3px] border-black p-2 rounded-full transform transition-transform group-hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      <Twitter className="h-5 w-5 text-white" strokeWidth={3} />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 border-2 border-black rounded-full"></div>
                  </a>
                  <a
                    href="https://facebook.com"
                    className="relative group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-green-500 border-[3px] border-black p-2 rounded-full transform transition-transform group-hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                      <Facebook
                        className="h-5 w-5 text-white"
                        strokeWidth={3}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 border-2 border-black rounded-full"></div>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="bg-blue-400 border-4 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform -rotate-1 relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 border-[3px] border-black rounded-full"></div>
                <h3 className="text-xl font-extrabold text-black mb-4 uppercase tracking-wider font-boldonse">
                  Quick Links
                </h3>
                <ul className="space-y-3 font-boldonse">
                  {[
                    { name: "Home", path: "/" },
                    { name: "Events", path: "/events" },
                    { name: "My Bookings", path: "/bookings" },
                    { name: "About", path: "/about" },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="transform hover:translate-x-1 transition-transform"
                    >
                      <Link
                        href={item.path}
                        className="relative group inline-block"
                      >
                        <div className="bg-white border-[3px] border-black py-1 px-3 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                          <Star
                            className="h-4 w-4 inline-block mr-2 text-red-500"
                            strokeWidth={3}
                          />
                          <span className="font-bold text-black">
                            {item.name}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <div className="bg-red-400 border-4 border-black rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform rotate-1 relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 border-[3px] border-black rounded-full"></div>
                <h3 className="text-xl font-extrabold text-black mb-4 uppercase tracking-wider font-boldonse">
                  Contact Us
                </h3>
                <p className="text-black flex items-center mb-4 font-bold font-boldonse">
                  <Mail className="mr-2 h-4 w-4" strokeWidth={3} />
                  contact@seevent.com
                </p>
                <form className="mt-4">
                  <div className="flex flex-col space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 font-space"
                    />
                    <button type="submit" className="relative group">
                      <div className="bg-yellow-400 border-[3px] border-black rounded-lg py-2 text-center font-extrabold text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] font-boldonse">
                        <span className="mr-1">SUBSCRIBE!</span>
                        <Zap className="h-4 w-4 inline-block" strokeWidth={3} />
                      </div>
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></div>
                      <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t-4 border-black relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 border-4 border-black px-6 py-1 rounded-full shadow-[0px_4px_0px_0px_rgba(0,0,0)]">
              <Star className="h-5 w-5 inline-block" strokeWidth={3} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white text-sm font-bold font-boldonse">
                © {new Date().getFullYear()} SeeVent. All rights reserved.
              </p>
              <p className="text-white text-sm font-bold flex items-center mt-2 md:mt-0 font-boldonse">
                Made with
                <span className="relative mx-2">
                  <Heart
                    className="h-5 w-5 text-red-500 z-10 relative"
                    fill="red"
                    strokeWidth={3}
                  />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-white border-2 border-black rounded-full animate-pulse"></span>
                </span>
                for events that matter
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
