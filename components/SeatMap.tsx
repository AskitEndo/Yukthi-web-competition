"use client";

import { useState, useEffect } from "react";

interface SeatMapProps {
  seats: Record<string, string>; // Map of seatId to status
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

export default function SeatMap({
  seats,
  selectedSeats,
  onSeatSelect,
}: SeatMapProps) {
  // Group seats into rows (assuming seat IDs are like "A1", "B3", etc.)
  const [seatMap, setSeatMap] = useState<{ [row: string]: string[] }>({});

  useEffect(() => {
    const groupedSeats: { [row: string]: string[] } = {};

    // Group seats by row
    Object.keys(seats).forEach((seatId) => {
      // Assuming seat IDs are in the format like "A1", "B2", etc.
      const row = seatId.charAt(0);
      if (!groupedSeats[row]) {
        groupedSeats[row] = [];
      }
      groupedSeats[row].push(seatId);
    });

    // Sort rows alphabetically
    const sortedMap: { [row: string]: string[] } = {};
    Object.keys(groupedSeats)
      .sort()
      .forEach((row) => {
        // Sort seats in each row numerically
        sortedMap[row] = groupedSeats[row].sort((a, b) => {
          const numA = parseInt(a.substring(1));
          const numB = parseInt(b.substring(1));
          return numA - numB;
        });
      });

    setSeatMap(sortedMap);
  }, [seats]);

  // Determine the status and CSS class for each seat
  const getSeatStatus = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      return {
        status: "selected",
        className:
          "bg-blue-400 border-2 border-black rounded cursor-pointer transform transition-all hover:scale-105",
      };
    }

    const status = seats[seatId];
    if (status === "booked") {
      return {
        status: "booked",
        className:
          "bg-red-300 border-2 border-black rounded cursor-not-allowed opacity-70",
      };
    }

    return {
      status: "available",
      className:
        "bg-green-300 border-2 border-black rounded cursor-pointer transform transition-all hover:scale-105 hover:bg-green-400",
    };
  };

  return (
    <div className="relative">
      {/* Stage area */}
      <div className="mb-8 relative">
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 p-2 text-center rounded-lg border-3 border-black transform perspective-1000 rotateX-10 shadow-[0px_4px_0px_0px_rgba(0,0,0)]">
          <p className="text-white font-bold font-boldonse uppercase tracking-wide">
            STAGE
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 border-2 border-black rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
      </div>

      {/* Seat rows */}
      <div className="space-y-3">
        {Object.keys(seatMap).map((row) => (
          <div key={row} className="flex flex-wrap items-center gap-2">
            <div className="w-6 h-6 font-bold flex items-center justify-center bg-gray-200 border-2 border-black rounded-full font-boldonse">
              {row}
            </div>

            <div className="flex flex-wrap gap-1">
              {seatMap[row].map((seatId) => {
                const { status, className } = getSeatStatus(seatId);
                return (
                  <button
                    key={seatId}
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${className}`}
                    onClick={() => status !== "booked" && onSeatSelect(seatId)}
                    disabled={status === "booked"}
                    title={`Seat ${seatId} - ${
                      status.charAt(0).toUpperCase() + status.slice(1)
                    }`}
                  >
                    {seatId.substring(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Seat count */}
      <div className="mt-4 text-center">
        <p className="text-xs font-space">
          {Object.keys(seats).length} total seats |
          {
            Object.values(seats).filter((status) => status === "available")
              .length
          }{" "}
          available
        </p>
      </div>
    </div>
  );
}
