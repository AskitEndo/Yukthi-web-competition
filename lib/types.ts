// lib/types.ts

export interface User {
  id: string; // Unique identifier (e.g., UUID)
  username: string;
  password?: string; // Store plain text for demo (!! VERY INSECURE !!)
  isAdmin: boolean;
}

export interface Seat {
  id: string; // Add this property - e.g., "R1C1", "R5C10"
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
  locationUrl?: string; // Optional URL for map location
  capacity: number;
  price: number;
  category: string;
  posterImageUrl?: string;
  bannerImageUrl?: string; // Add this property
  published: boolean;
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

export interface EventFormData {
  id?: string;
  name: string;
  description: string;
  date: string; // Just the date part in YYYY-MM-DD format
  time: string; // Time in HH:MM format
  location: string;
  locationUrl?: string;
  capacity: number;
  price: number;
  category: string;
  posterImageUrl?: string;
  bannerImageUrl?: string;
  published: boolean;
  rows?: number;
  cols?: number;
}
