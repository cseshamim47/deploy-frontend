"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGears, FaUser, FaGasPump } from "react-icons/fa6";
import { toast } from "sonner";
import { useBikeRental } from "@/context/BikeRentalContext";

type BikeCardProps = {
   title: string;
   description: {
      transmission: string;
      seatingCapacity: string;
      fuelType: string;
   };
   imageSrc: string;
   packages: {
      duration: string;
      pricePerDay: number;
      distanceIncluded: string;
   }[];
   deposit: number;
   makeYear: number;
   locations: { value: string; label: string }[];
   onPackageChange?: (duration: string) => void;
};

const BikeCard: React.FC<BikeCardProps> = ({
   title,
   description,
   imageSrc,
   packages,
   deposit,
   makeYear,
   locations,
   onPackageChange,
}) => {
   const router = useRouter();
   const [viewAllPackages, setViewAllPackages] = useState(false);
   const [selectedPackage, setSelectedPackage] = useState(packages[0]);
   const [totalPrice, setTotalPrice] = useState(selectedPackage.pricePerDay);
   const { setFilters } = useBikeRental();

   const handlePackageSelect = (pkg: { duration: string; pricePerDay: number; distanceIncluded: string }) => {
      // Normalize the duration string
      const getDurationKey = (duration: string) => {
         const d = duration.toLowerCase();
         if (d.includes('7') || d.includes('week')) return '7days';
         if (d.includes('15')) return '15days';
         if (d.includes('month') && !d.includes('3') && !d.includes('6')) return 'monthly';
         if (d.includes('3')) return '3months';
         if (d.includes('6')) return '6months';
         if (d.includes('year')) return 'yearly';
         return 'daily';
      };

      const normalizedDuration = getDurationKey(pkg.duration);
      setSelectedPackage(pkg);
      setFilters(prev => ({ ...prev, duration: normalizedDuration }));
      toast.success(`Package updated to ${pkg.duration}`, { id: 'package-update' });
      setViewAllPackages(false);
   };

   // Update useEffect for calculating total price
   useEffect(() => {
      let days = 1;
      const duration = selectedPackage.duration.toLowerCase();

      if (duration.includes('year')) days = 365;
      else if (duration.includes('6')) days = 180;
      else if (duration.includes('3')) days = 90;
      else if (duration.includes('month') && !duration.includes('3') && !duration.includes('6')) days = 30;
      else if (duration.includes('15')) days = 15;
      else if (duration.includes('7') || duration.includes('week')) days = 7;

      setTotalPrice(selectedPackage.pricePerDay * days);
   }, [selectedPackage]);


   const handleBookNow = () => {
      const formattedLocation = locations[0]?.value.toLowerCase() || "default";
      const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
      router.push(`search/${formattedTitle}`);
   };

  return (
     <div className="w-[300px] h-min rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 text-center border-b text-secondary-foreground">
           <h3 className="text-sm font-semibold">{title}</h3>
        </div>

        {/* Image */}
        <div className="p-3 flex justify-center w-[250px] h-[160px] mx-auto">
           <Image src={imageSrc} alt={title} width={250} height={160} className="rounded-md " />
        </div>

        {/* Features */}
        <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground border-t">
           <div className="flex items-center gap-1">
              <FaGears size={14} />
              <span>{description.transmission}</span>
           </div>
           <div className="flex items-center gap-1">
              <FaUser size={14} />
              <span>{description.seatingCapacity}</span>
           </div>
           <div className="flex items-center gap-1">
              <FaGasPump size={14} />
              <span>{description.fuelType}</span>
           </div>
        </div>

        {/* Location - "Available At" */}
        {locations.length > 1 ? (
           <select className="text-sm font-medium text-primary">
              {locations.map((loc) => (
                 <option key={loc.value} value={loc.value}>
                    {loc.label}
                 </option>
              ))}
           </select>
        ) : (
           <p className="text-sm font-bold text-primary">{locations[0]?.label}</p>
        )}

        {/* Pricing Section */}
        <div className="px-3 py-2 border-t">
           {viewAllPackages ? (
              <div className="grid grid-cols-2 gap-2">
                 {packages.map((pkg, index) => (
                    <div
                       key={index}
                       onClick={() => handlePackageSelect(pkg)}
                       className={`p-2 border rounded-md cursor-pointer text-xs transition ${selectedPackage.duration === pkg.duration
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary hover:bg-accent"
                          }`}
                    >
                       <p className="font-medium">{pkg.duration}</p>
                       <p>₹{pkg.pricePerDay}/day</p>
                       <p className="text-xs text-muted-foreground">{pkg.distanceIncluded} km included</p>
                    </div>
                 ))}
              </div>
           ) : (
                 <>
                    <div className="flex justify-between items-center">
                       <div className="flex items-baseline">
                          <span className="text-lg font-semibold text-primary-foreground">₹{totalPrice}</span>
                          <span className="text-xs text-muted-foreground ml-1">Total</span>
                       </div>
                       <div>
                          <p className="text-xs text-primary-foreground">{selectedPackage.distanceIncluded} km limit</p>
                          <p className="text-xs text-primary-foreground">Extra ₹4/km</p>
                          <p className="text-xs text-primary-foreground">Fuel Excluded</p>
                       </div>
                    </div>
                    <button
                       onClick={handleBookNow}
                       className="w-full mt-2 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                    >
                       Book Now
                    </button>
                 </>
           )}
        </div>

        {/* View Packages Button - Centered & Styled */}
        <div className="px-3 py-2 flex justify-center">
           <button
              onClick={() => setViewAllPackages(!viewAllPackages)}
              className="w-full py-2 text-sm font-medium bg-secondary text-muted-foreground rounded-md hover:bg-muted/80 transition"
           >
              {viewAllPackages ? "Hide Packages" : "View Packages"}
           </button>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 flex justify-between text-xs text-muted-foreground border-t">
           <div>Deposit: ₹{deposit}</div>
           <div>Year: {makeYear}</div>
        </div>
     </div>
  );
};

export default BikeCard;
