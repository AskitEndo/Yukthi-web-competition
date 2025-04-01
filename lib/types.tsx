// lib/types.ts

export interface User {
  id: string; // Unique identifier (e.g., UUID)
  username: string;
  password?: string; // Store plain text for demo (!! VERY INSECURE !!)
  isAdmin: boolean;
}

export interface Seat {
  id: string; // e.g., "R1C1", "R5C10"
  row: number;
  col: number;
  isBooked: boolean;
  userId?: string | null; // ID of the user who booked it
}

export interface Event {
  id: string; // Unique identifier (e.g., UUID or slug)
  name: string;
  description: string;
  date: string; // ISO date string (e.g., "2024-08-15T19:00:00Z")
  location: string; // Simple text address or description
  locationUrl?: string; // Optional Google Maps link etc.
  posterImageUrl: string; // URL or path to poster image
  bannerImageUrl?: string; // Optional larger banner image
  rows: number;
  cols: number;
  seats: Seat[][]; // 2D array representing the seating layout
}

export interface Booking {
  id: string; // Unique booking identifier (e.g., UUID)
  eventId: string;
  userId: string;
  seats: string[]; // Array of seat IDs booked (e.g., ["R1C1", "R1C2"])
  bookingTime: string; // ISO date string
  paymentStatus: "pending" | "paid" | "pay_at_event";
}
