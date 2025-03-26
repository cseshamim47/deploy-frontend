"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FilterState, Bike } from '@/lib/types';

interface BikeRentalContextType {
   filters: FilterState;
   setFilters: (filters: FilterState) => void;
   selectedLocation: string;
   setSelectedLocation: (location: string) => void;
   updateDatesByDuration: (duration: string) => void;
}

const BikeRentalContext = createContext<BikeRentalContextType | undefined>(undefined);

export const BikeRentalProvider = ({ children }: { children: React.ReactNode }) => {
   const [filters, setFilters] = useState<FilterState>({
      duration: "daily",
      transmission: [],
      branch: [],
      brand: [],
      pickupDate: new Date(),
      dropoffDate: new Date(new Date().setDate(new Date().getDate() + 1)),
   });
   const [selectedLocation, setSelectedLocation] = useState("");

   const updateDatesByDuration = (duration: string) => {
      const pickupDate = new Date();
      const dropoffDate = new Date();

      switch (duration.toLowerCase()) {
         case '7days':
         case 'weekly':
            dropoffDate.setDate(pickupDate.getDate() + 7);
            break;
         case '15days':
            dropoffDate.setDate(pickupDate.getDate() + 15);
            break;
         case 'monthly':
            dropoffDate.setMonth(pickupDate.getMonth() + 1);
            break;
         case '3months':
            dropoffDate.setMonth(pickupDate.getMonth() + 3);
            break;
         case '6months':
            dropoffDate.setMonth(pickupDate.getMonth() + 6);
            break;
         case 'yearly':
            dropoffDate.setFullYear(pickupDate.getFullYear() + 1);
            break;
         default: // daily
            dropoffDate.setDate(pickupDate.getDate() + 1);
      }

      setFilters(prev => ({
         ...prev,
         pickupDate,
         dropoffDate
      }));
   };

   // Update dates whenever duration changes
   useEffect(() => {
      updateDatesByDuration(filters.duration);
   }, [filters.duration]);

   return (
      <BikeRentalContext.Provider value={{
         filters,
         setFilters,
         selectedLocation,
         setSelectedLocation,
         updateDatesByDuration
      }}>
         {children}
      </BikeRentalContext.Provider>
   );
};


export const useBikeRental = () => {
   const context = useContext(BikeRentalContext);
   if (!context) {
      throw new Error('useBikeRental must be used within a BikeRentalProvider');
   }
   return context;
};
