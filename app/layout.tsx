// app/layout.tsx
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NavigationEvents } from "./navigation-events";

// Define fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// Boldonse isn't available in next/font/google, so we'll import it through CSS

export const metadata: Metadata = {
  title: "SeeVent - Event Booking Platform",
  description: "Book your tickets for exciting events happening around you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <head>
        {/* Import Boldonse font which isn't available via next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <LoadingProvider>
            <NavigationEvents />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
