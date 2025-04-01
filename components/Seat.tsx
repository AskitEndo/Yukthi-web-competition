// components/Seat.tsx
"use client"; // Individual seats need to handle clicks

import { Seat as SeatType } from "@/lib/types"; // Renamed SeatType to avoid conflict
import { Sparkles, X } from "lucide-react";

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
}

export default function Seat({ seat, isSelected, onSelect }: SeatProps) {
  const { id, isBooked } = seat;

  // Extract the column number for display
  const colNumber = seat.id.substring(seat.id.indexOf("C") + 1);

  const handleClick = () => {
    if (!isBooked) {
      onSelect(id);
    }
  };

  // Comic book style seat based on state
  if (isBooked) {
    // Booked seat - unavailable
    return (
      <button
        type="button"
        className="relative w-8 h-8 flex items-center justify-center cursor-not-allowed"
        disabled={true}
        aria-label={`Seat ${id} Booked`}
        title={`Seat ${id} - Already booked`}
      >
        <div className="absolute inset-0 bg-gray-500 border-[2px] border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0)] transform rotate-1">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: "3px 3px",
            }}
          ></div>
        </div>
        <X className="relative z-10 h-4 w-4 text-white" strokeWidth={3} />
      </button>
    );
  } else if (isSelected) {
    // Selected seat
    return (
      <button
        type="button"
        className="relative w-8 h-8 flex items-center justify-center cursor-pointer group"
        onClick={handleClick}
        aria-label={`Seat ${id} Selected`}
        title={`Seat ${id} - Selected`}
      >
        <div className="absolute inset-0 bg-yellow-400 border-[2px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform -rotate-1">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
              backgroundSize: "3px 3px",
            }}
          ></div>
        </div>
        <Sparkles
          className="relative z-10 h-4 w-4 text-black"
          strokeWidth={3}
        />
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 border-[1px] border-black rounded-full"></div>
        <div className="absolute bottom-6 left-0 bg-blue-400 border-[1px] border-black rounded-sm px-1 py-0 text-[8px] font-bold text-black font-boldonse opacity-0 group-hover:opacity-100 transition-opacity">
          {colNumber}
        </div>
      </button>
    );
  } else {
    // Available seat
    return (
      <button
        type="button"
        className="relative w-8 h-8 flex items-center justify-center cursor-pointer group transform transition-transform duration-150 hover:scale-110"
        onClick={handleClick}
        aria-label={`Seat ${id} Available`}
        title={`Seat ${id} - Available`}
      >
        <div className="absolute inset-0 bg-green-200 border-[2px] border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-colors duration-200 hover:bg-green-300">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: "3px 3px",
            }}
          ></div>
        </div>
        <span className="relative z-10 text-xs font-bold text-green-800 font-space">
          {colNumber}
        </span>
        <div className="absolute bottom-6 left-0 bg-blue-400 border-[1px] border-black rounded-sm px-1 py-0 text-[8px] font-bold text-black font-boldonse opacity-0 group-hover:opacity-100 transition-opacity">
          {colNumber}
        </div>
      </button>
    );
  }
}
