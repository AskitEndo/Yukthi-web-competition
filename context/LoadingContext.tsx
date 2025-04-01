"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import AppLoader from "@/components/AppLoader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Create with default values to prevent errors when used before mount
const defaultValue: LoadingContextType = {
  isLoading: false,
  setIsLoading: () => {}, // No-op function
};

// Use the default value to avoid undefined errors
const LoadingContext = createContext<LoadingContextType>(defaultValue);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <AppLoader fullScreen={true} />}
      {children}
    </LoadingContext.Provider>
  );
}

// Make the hook safer when used outside the provider
export function useLoading() {
  return useContext(LoadingContext);
}
