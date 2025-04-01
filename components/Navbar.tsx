// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Event Booker
        </Link>
        <div>
          <Link href="/login" className="mr-4 hover:underline">
            Login
          </Link>
          {/* Add other links later */}
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
