"use client";

import { useState, useCallback } from "react";
import { useLoading } from "@/context/LoadingContext";

interface ApiOptions {
  showLoader?: boolean;
  headers?: Record<string, string>;
}

export function useApi() {
  const { setIsLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async <T>(
      url: string,
      method: string = "GET",
      body?: any,
      options: ApiOptions = { showLoader: true }
    ): Promise<T | null> => {
      const { showLoader = true, headers = {} } = options;

      if (showLoader) {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        return null;
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [setIsLoading]
  );

  return { fetchData, error };
}
