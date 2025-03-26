"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCitySelect: (city: string) => void;
}

interface City {
  name: string;
  image: string;
}

const CityModal = ({ isOpen, onClose, onCitySelect }: CityModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: cities, error } = useSWR<City[]>(`${process.env.NEXT_PUBLIC_API_URL}/city`, fetcher);

  const filteredCities = cities?.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

//   console.log(cities);
  
  if (error) return <div>Failed to load cities</div>;
//   if (!cities) return <div>Loading...</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select a City</DialogTitle>
        </DialogHeader>

           <div className="mb-4 sticky top-0  z-10 p-4">
          <Input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

           {/* Scrollable City List */}
           <div className="overflow-y-auto max-h-[65vh] px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {filteredCities.map((city) => (
                    <div
                       key={city.name}
                       className="cursor-pointer hover:scale-105 transition-transform"
                       onClick={() => {
                          onCitySelect(city.name);
                          onClose();
                       }}
                    >
                       <div className="relative h-32 w-full rounded-lg overflow-hidden">
                          <Image
                             src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}${city.image}`}
                             alt={city.name}
                             fill
                             className="object-cover"
                          />
                       </div>
                       <p className="mt-2 text-center font-medium">{city.name}</p>
                    </div>
                 ))}
              </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CityModal;
