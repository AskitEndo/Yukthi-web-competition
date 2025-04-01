// components/Navbar.tsx
"use client"; // Navbar now needs client-side logic

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook

export default function Navbar() {
  const { user, isLoading, logout } = useAuth(); // Get auth state and functions

  const handleLogout = async () => {
    await logout();
    // Redirect is handled within the logout function now
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Event Booker
        </Link>
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <span className="text-sm animate-pulse">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm hidden sm:inline">
                Hey, {user.username}!
              </span>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="hover:underline text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/bookings"
                className="hover:underline text-sm font-medium"
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
