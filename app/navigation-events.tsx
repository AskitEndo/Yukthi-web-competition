"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use optional chaining to handle potential undefined context
  const { setIsLoading } = useLoading?.() || { setIsLoading: () => {} };

  useEffect(() => {
    const handleRouteChangeStart = () => {
      try {
        console.log("Route change starting");
        setIsLoading(true);
      } catch (e) {
        console.error("Failed to set loading state", e);
      }
    };

    const handleRouteChangeComplete = () => {
      try {
        console.log("Route change complete");
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to set loading state", e);
      }
    };

    // Add event listeners but with caution
    window.addEventListener("beforeunload", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      // Always ensure loading is cleared on unmount
      handleRouteChangeComplete();
    };
  }, [setIsLoading]);

  // This effect will run when the route changes within the Next.js app
  useEffect(() => {
    try {
      // Always set loading to false when component mounts or updates
      setIsLoading(false);
    } catch (e) {
      console.error("Failed to set loading state", e);
    }
  }, [pathname, searchParams, setIsLoading]);

  return null;
}
