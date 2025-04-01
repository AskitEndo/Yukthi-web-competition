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
        setIsLoading(true);
      } catch (e) {
        console.error("Failed to set loading state", e);
      }
    };

    const handleRouteChangeComplete = () => {
      try {
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to set loading state", e);
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
    };
  }, [setIsLoading]);

  // This effect will run when the route changes within the Next.js app
  useEffect(() => {
    try {
      setIsLoading(false);
    } catch (e) {
      console.error("Failed to set loading state", e);
    }
  }, [pathname, searchParams, setIsLoading]);

  return null;
}
