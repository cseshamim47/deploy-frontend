"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SearchState {
  city: string;
  pickupDateTime: Date;
  dropoffDateTime: Date;
  duration: {
    days: number;
    hours: number;
  };
}

interface SearchContextType {
  searchState: SearchState;
  updateCity: (city: string) => void;
  updatePickupDateTime: (date: Date) => void;
  updateDropoffDateTime: (date: Date) => void;
  updateDuration: (days: number, hours: number) => void;
}

const defaultState: SearchState = {
  city: "Select City",
  pickupDateTime: (() => {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Reset minutes, seconds and milliseconds
    now.setHours(now.getHours() + 1); // Add 1 hour
    return now;
  })(),
  dropoffDateTime: (() => {
    const tomorrow = new Date();
    tomorrow.setMinutes(0, 0, 0); // Reset minutes, seconds and milliseconds
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 1); // Set same hour as pickup time
    return tomorrow;
  })(),
  duration: {
    days: 1,
    hours: 0,
  },
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchState, setSearchState] = useState<SearchState>(defaultState);

  useEffect(() => {
    console.log("Search Context Updated:", searchState);
  }, [searchState]);

  const updateCity = (city: string) => {
    setSearchState((prev) => ({
      ...prev,
      city,
    }));
  };

  const updatePickupDateTime = (date: Date) => {
    setSearchState((prev) => ({
      ...prev,
      pickupDateTime: date,
    }));
  };

  const updateDropoffDateTime = (date: Date) => {
    setSearchState((prev) => ({
      ...prev,
      dropoffDateTime: date,
    }));
  };

  const updateDuration = (days: number, hours: number) => {
    setSearchState((prev) => ({
      ...prev,
      duration: { days, hours },
    }));
  };

  const value = {
    searchState,
    updateCity,
    updatePickupDateTime,
    updateDropoffDateTime,
    updateDuration,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
