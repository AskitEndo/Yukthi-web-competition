/**
 * Formats a date string or Date object into a readable format
 * @param dateInput - Date string in ISO format or Date object
 * @returns Formatted date string (e.g., "Apr 15, 2025")
 */
export function formatDate(dateInput: string | Date): string {
  if (!dateInput) return "TBA";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Format: "Apr 15, 2025"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date string or Date object into a date and time format
 * @param dateInput - Date string in ISO format or Date object
 * @returns Formatted date and time string (e.g., "Apr 15, 2025, 6:00 PM")
 */
export function formatDateTime(dateInput: string | Date): string {
  if (!dateInput) return "TBA";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Format: "Apr 15, 2025, 6:00 PM"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Checks if a date is in the past
 * @param dateInput - Date string in ISO format or Date object
 * @returns Boolean indicating if the date is in the past
 */
export function isPastDate(dateInput: string | Date): boolean {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();

  return date < now;
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param dateInput - Date string in ISO format or Date object
 * @returns Relative time string
 */
export function getRelativeTimeString(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (diffInSecs < 0) {
    // Past
    if (diffInSecs > -60) return `${Math.abs(diffInSecs)} seconds ago`;
    if (diffInMins > -60) return `${Math.abs(diffInMins)} minutes ago`;
    if (diffInHours > -24) return `${Math.abs(diffInHours)} hours ago`;
    if (diffInDays > -7) return `${Math.abs(diffInDays)} days ago`;
    return formatDate(date);
  } else {
    // Future
    if (diffInSecs < 60) return `in ${diffInSecs} seconds`;
    if (diffInMins < 60) return `in ${diffInMins} minutes`;
    if (diffInHours < 24) return `in ${diffInHours} hours`;
    if (diffInDays < 7) return `in ${diffInDays} days`;
    return formatDate(date);
  }
}
