// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Ticket,
  LogOut,
  LogIn,
  User,
  ShieldCheck,
  Music,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="relative">
      {/* Comic book background with halftone effect */}
      <div className="absolute inset-0 bg-yellow-400 overflow-hidden">
        {/* Halftone dots overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        ></div>

        {/* Comic style zig-zag border at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-400"
          style={{
            clipPath:
              "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo area - Comic Book Style */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="bg-red-500 border-4 border-black rounded-full p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-transform group-hover:scale-105">
                <Zap
                  className="h-8 w-8 text-yellow-300 group-hover:text-yellow-200"
                  strokeWidth={3}
                />
              </div>
              <div className="absolute top-0 right-0 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full"></div>
            </div>
            <div className="relative">
              <div className="bg-yellow-300 border-4 border-black py-1 px-4 rounded-xl transform translate-y-0 transition-transform shadow-[5px_5px_0px_0px_rgba(0,0,0)] group-hover:translate-y-[-2px]">
                <span className="text-2xl font-extrabold text-black font-boldonse">
                  SeeVent!
                </span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="relative">
                <div className="bg-white border-3 border-black rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                  <div className="h-4 w-4 rounded-full bg-red-500 animate-ping mr-2 inline-block"></div>
                  <span
                    className="font-bold"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    LOADING...
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-300 border-2 border-black rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <div className="hidden md:flex relative">
                  <div className="bg-blue-400 border-3 border-black rounded-lg px-4 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                    <User
                      className="h-4 w-4 mr-1 inline-block"
                      strokeWidth={3}
                    />
                    <span className="font-bold text-black font-boldonse">
                      {user.username}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
                </div>

                {user.isAdmin && (
                  <Link href="/admin" className="relative group">
                    <div className="bg-red-500 border-3 border-black rounded-lg px-4 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)]">
                      <ShieldCheck
                        className="h-4 w-4 mr-1 inline-block"
                        strokeWidth={3}
                      />
                      <span className="font-bold text-white font-boldonse">
                        ADMIN
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full"></div>
                  </Link>
                )}

                <Link href="/bookings" className="relative group">
                  <div className="bg-green-500 border-3 border-black rounded-lg px-4 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)]">
                    <Ticket
                      className="h-4 w-4 mr-1 inline-block"
                      strokeWidth={3}
                    />
                    <span className="font-bold text-white font-boldonse">
                      TICKETS
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
                </Link>

                <button onClick={handleLogout} className="relative group">
                  <div className="bg-black border-3 border-red-500 rounded-lg px-4 py-1 shadow-[3px_3px_0px_0px_rgba(255,0,0,0.7)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(255,0,0,0.7)]">
                    <LogOut
                      className="h-4 w-4 mr-1 inline-block text-red-500"
                      strokeWidth={3}
                    />
                    <span className="font-bold text-white font-boldonse">
                      LOGOUT
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full"></div>
                </button>
              </>
            ) : (
              <Link href="/login" className="relative group">
                <div className="bg-blue-500 border-3 border-black rounded-lg px-6 py-2 shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-3px] group-hover:shadow-[5px_8px_0px_0px_rgba(0,0,0)]">
                  <LogIn
                    className="h-5 w-5 mr-1 inline-block text-white"
                    strokeWidth={3}
                  />
                  <span className="font-extrabold text-white font-boldonse">
                    Get Started
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-300 border-2 border-black rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse-border {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </nav>
  );
}
