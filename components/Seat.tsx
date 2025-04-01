// components/Seat.tsx
"use client"; // Individual seats need to handle clicks

import { Seat as SeatType } from "@/lib/types"; // Renamed SeatType to avoid conflict

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
}

export default function Seat({ seat, isSelected, onSelect }: SeatProps) {
  const { id, isBooked } = seat;

  // Determine seat styling based on state
  let seatClass =
    "w-8 h-8 border border-gray-400 rounded flex items-center justify-center text-xs cursor-pointer transition-colors duration-150";
  let content: React.ReactNode = seat.id.substring(seat.id.indexOf("C") + 1); // Show column number

  if (isBooked) {
    seatClass += " bg-gray-500 text-gray-300 cursor-not-allowed";
    content = "X";
  } else if (isSelected) {
    seatClass += " bg-blue-500 border-blue-700 text-white ring-2 ring-blue-300";
  } else {
    seatClass += " bg-green-200 hover:bg-green-300 text-green-800";
  }

  const handleClick = () => {
    if (!isBooked) {
      onSelect(id);
    }
  };

  return (
    <button
      type="button" // Prevent form submission if nested
      className={seatClass}
      onClick={handleClick}
      disabled={isBooked}
      aria-label={`Seat ${id} ${
        isBooked ? "Booked" : isSelected ? "Selected" : "Available"
      }`}
      title={`Seat ${id}`}
    >
      {/* Optionally display row/col info or just visually represent */}
      {/* {seat.row}-{seat.col} */}
      {content}
    </button>
  );
}
