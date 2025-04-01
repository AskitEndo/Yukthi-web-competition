// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Tailwind styles
import Navbar from "@/components/Navbar"; // Adjust import path if alias is different
import Footer from "@/components/Footer"; // Adjust import path if alias is different
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeeVent",
  description: "See and you went to the event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <AuthProvider>
          {" "}
          {/* Wrap contents with AuthProvider */}
          <div className="flex flex-col min-h-screen">
            <Navbar /> {/* Navbar can now use useAuth */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
