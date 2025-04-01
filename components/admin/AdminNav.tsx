"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Calendar,
  Users,
  Ticket,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <Home className="w-4 h-4" strokeWidth={3} />,
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: <Calendar className="w-4 h-4" strokeWidth={3} />,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <Ticket className="w-4 h-4" strokeWidth={3} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="w-4 h-4" strokeWidth={3} />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-blue-600 border-b-4 border-black relative">
      {/* Comic-style halftone pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title Section */}
          <div className="flex items-center">
            <Link href="/admin" className="relative group">
              <div className="flex-shrink-0 bg-yellow-400 border-[3px] border-black rounded-lg px-3 py-1 transform rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0)] transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-[3px_5px_0px_0px_rgba(0,0,0)]">
                <span className="font-extrabold text-xl text-black uppercase tracking-wider flex items-center font-boldonse">
                  <Zap className="mr-1 h-5 w-5" strokeWidth={3} />
                  ADMIN PANEL
                </span>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-6">
              <div className="flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="relative group"
                  >
                    <div
                      className={`px-3 py-2 mx-1 rounded-lg border-[2px] border-black text-sm font-bold transition-all transform ${
                        isActive(item.path)
                          ? "bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0)] rotate-1"
                          : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:translate-y-[-2px] hover:bg-green-400"
                      } font-boldonse`}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        <span className="ml-1">{item.name}</span>
                      </span>
                    </div>
                    {isActive(item.path) && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 border-[1px] border-black rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop User Controls */}
          <div className="hidden md:block">
            <div className="flex items-center md:ml-6">
              <div className="flex items-center space-x-3">
                {/* Username Display */}
                <div className="bg-blue-400 border-[2px] border-black rounded-lg px-3 py-1 text-black font-bold font-boldonse transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  <span className="text-sm">{user?.username}</span>
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 border-[1px] border-black rounded-full"></div>
                </div>

                {/* Main Site Link */}
                <Link href="/" className="relative group">
                  <div className="bg-yellow-400 border-[2px] border-black rounded-lg px-3 py-1 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all transform group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" strokeWidth={3} />
                    <span className="text-sm">MAIN SITE</span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button onClick={() => logout()} className="relative group">
                  <div className="bg-red-500 border-[2px] border-black rounded-lg px-3 py-1 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all transform group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                    <LogOut className="mr-1 h-4 w-4" strokeWidth={3} />
                    <span className="text-sm">SIGN OUT</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 border-[1px] border-black rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              <div className="bg-yellow-400 border-[2px] border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-transform hover:translate-y-[-2px] hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)]">
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6 text-black" strokeWidth={3} />
                ) : (
                  <Menu className="block h-6 w-6 text-black" strokeWidth={3} />
                )}
              </div>
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 border-[1px] border-black rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden relative z-20">
          <div className="bg-white border-t-4 border-b-4 border-black">
            {/* Comic-style halftone pattern for mobile menu */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.7) 1px, transparent 1px)`,
                backgroundSize: "4px 4px",
              }}
            ></div>

            {/* Navigation Items */}
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 relative z-10">
              {navItems.map((item) => (
                <Link key={item.name} href={item.path} className="block w-full">
                  <div
                    className={`relative w-full px-3 py-2 rounded-lg border-[2px] border-black font-medium flex items-center ${
                      isActive(item.path)
                        ? "bg-red-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0)] transform rotate-1"
                        : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]"
                    } font-boldonse`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4" strokeWidth={3} />

                    {isActive(item.path) && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 border-[1px] border-black rounded-full"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* User controls */}
            <div className="pt-4 pb-3 border-t-[3px] border-dashed border-black">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="bg-blue-400 inline-block border-[2px] border-black rounded-lg px-3 py-1 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse transform -rotate-1">
                    {user?.username}
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 border-[1px] border-black rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-2 space-y-2">
                <Link href="/" className="block w-full">
                  <div className="bg-yellow-400 w-full border-[2px] border-black rounded-lg px-3 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                    MAIN SITE
                  </div>
                </Link>

                <button onClick={() => logout()} className="w-full">
                  <div className="bg-red-500 w-full text-left border-[2px] border-black rounded-lg px-3 py-2 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0)] font-boldonse flex items-center">
                    <LogOut className="mr-2 h-4 w-4" strokeWidth={3} />
                    SIGN OUT
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
