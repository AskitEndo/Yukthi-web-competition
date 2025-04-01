// lib/data-utils.ts
import fs from "fs/promises";
import path from "path";
import { User, Event, Booking } from "./types"; // Adjust path as needed

// Define paths relative to the project root
const dataDir = path.join(process.cwd(), "data");
const usersFilePath = path.join(dataDir, "users.json");
const eventsFilePath = path.join(dataDir, "events.json");
const bookingsFilePath = path.join(dataDir, "bookings.json");

// --- Generic Read Function ---
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    // Check if directory exists, create if not (useful for first runs/git clones)
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Check if file exists, create with empty array if not
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, "[]", "utf-8");
      console.log(`Created empty data file: ${filePath}`);
    }

    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    // Return empty array on error to prevent crashing
    return [];
  }
}

// --- Generic Write Function ---
async function writeData<T>(filePath: string, data: T[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true }); // Ensure directory exists
    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
    await fs.writeFile(filePath, jsonData, "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
}

// --- Specific Data Functions ---

// Users
export const getUsers = (): Promise<User[]> => readData<User>(usersFilePath);
export const saveUsers = (users: User[]): Promise<boolean> =>
  writeData<User>(usersFilePath, users);

// Events
export const getEvents = (): Promise<Event[]> =>
  readData<Event>(eventsFilePath);
export const saveEvents = (events: Event[]): Promise<boolean> =>
  writeData<Event>(eventsFilePath, events);

// Bookings
export const getBookings = (): Promise<Booking[]> =>
  readData<Booking>(bookingsFilePath);
export const saveBookings = (bookings: Booking[]): Promise<boolean> =>
  writeData<Booking>(bookingsFilePath, bookings);

// --- Helper Functions (Examples - Add more as needed) ---

export async function findUserByUsername(
  username: string
): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user) => user.username === username);
}

export async function findEventById(
  eventId: string
): Promise<Event | undefined> {
  const events = await getEvents();
  return events.find((event) => event.id === eventId);
}

export async function findBookingById(
  bookingId: string
): Promise<Booking | undefined> {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.id === bookingId);
}

/**
 * Find a user by ID
 * @param userId The ID of the user to find
 * @returns The user object if found, undefined otherwise
 */
export async function findUserById(userId: string): Promise<User | undefined> {
  const users = await getUsers(); // Assuming you already have a getUsers function
  return users.find((user) => user.id === userId);
}

// Function to generate seat layout (we'll use this in the Admin panel later)
export function generateSeats(rows: number, cols: number): Seat[][] {
  const seats: Seat[][] = [];
  for (let r = 1; r <= rows; r++) {
    const rowSeats: Seat[] = [];
    for (let c = 1; c <= cols; c++) {
      rowSeats.push({
        id: `R${r}C${c}`,
        row: r,
        col: c,
        isBooked: false,
        userId: null,
      });
    }
    seats.push(rowSeats);
  }
  return seats;
}
