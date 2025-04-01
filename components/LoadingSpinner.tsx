"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "blue" | "green" | "red" | "yellow";
  centered?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  color = "blue",
  centered = true,
}: LoadingSpinnerProps) {
  // Determine size classes based on prop
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-20 w-20",
  };

  // Comic-style border widths
  const borderWidths = {
    small: "border-[2px]",
    medium: "border-[3px]",
    large: "border-[4px]",
  };

  // Comic-style colors with brighter palette
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-400",
  };

  // Determine shadow size based on spinner size
  const shadowSize = {
    small: "shadow-[2px_2px_0px_0px_rgba(0,0,0)]",
    medium: "shadow-[3px_3px_0px_0px_rgba(0,0,0)]",
    large: "shadow-[4px_4px_0px_0px_rgba(0,0,0)]",
  };

  // Create comic-style rotating shapes
  return (
    <div className={centered ? "flex justify-center items-center py-6" : ""}>
      <div className="relative" role="status" aria-label="Loading">
        {/* Main spinner */}
        <div
          className={`
            relative ${sizeClasses[size]} ${colorClasses[color]} ${borderWidths[size]} 
            border-black rounded-lg ${shadowSize[size]} animate-bounce
            flex items-center justify-center font-boldonse
          `}
          style={{
            animationDuration: "1s",
          }}
        >
          <span className="text-black font-bold">!</span>

          {/* Halftone pattern overlay */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: "4px 4px",
            }}
          ></div>

          {/* Decoration dots */}
          <div
            className={`absolute -top-1 -right-1 h-3 w-3 bg-yellow-300 border-2 border-black rounded-full`}
          ></div>
          <div
            className={`absolute -bottom-1 -left-1 h-3 w-3 bg-red-500 border-2 border-black rounded-full`}
          ></div>
        </div>

        {/* Orbiting element */}
        <div
          className={`
            absolute top-0 left-0 ${borderWidths[size]} 
            border-black rounded-full ${shadowSize[size]}
            bg-white
          `}
          style={{
            height: "30%",
            width: "30%",
            animation: "orbit 2s linear infinite",
          }}
        >
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 border-1 border-black rounded-full"></div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white border-[2px] border-black rounded-lg px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
          <span className="text-xs font-bold font-space">LOADING...</span>
        </div>

        {/* Accessibility text */}
        <span className="sr-only">Loading...</span>
      </div>

      {/* CSS Animation for orbiting element */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg)
              translateX(
                ${size === "small"
                  ? "12px"
                  : size === "medium"
                  ? "18px"
                  : "30px"}
              )
              rotate(0deg);
          }
          to {
            transform: rotate(360deg)
              translateX(
                ${size === "small"
                  ? "12px"
                  : size === "medium"
                  ? "18px"
                  : "30px"}
              )
              rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
