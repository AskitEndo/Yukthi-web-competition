"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "blue" | "green" | "gray";
  centered?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  color = "blue",
  centered = true,
}: LoadingSpinnerProps) {
  // Determine size classes based on prop
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4",
  };

  // Determine color classes based on prop
  const colorClasses = {
    blue: "border-t-blue-600 border-r-blue-300 border-b-blue-100 border-l-blue-400",
    green:
      "border-t-green-600 border-r-green-300 border-b-green-100 border-l-green-400",
    gray: "border-t-gray-600 border-r-gray-300 border-b-gray-100 border-l-gray-400",
  };

  // Combine classes based on props
  const spinnerClasses = `
    animate-spin rounded-full
    ${sizeClasses[size]}
    ${colorClasses[color]}
  `;

  // Add container classes for centering if needed
  const containerClasses = centered
    ? "flex justify-center items-center py-4"
    : "";

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
