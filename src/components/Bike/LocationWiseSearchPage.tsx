"use client";
import React, { useState } from "react";
import useSWR from "swr";
import BikeCard from "./BikeCard";
import BikeFilters from "./BikeFilters";
import { Bike, FilterState } from "@/lib/types";
import Search from "../Hompage/Search/Search";
import { toast } from "sonner";
import { useBikeRental } from "@/context/BikeRentalContext";
import { useSearch } from "@/context/SearchContext";
import Spinner from "@/components/Spinner/Spinner";

interface SearchParams {
  city: string;
  pickup_date: string;
  dropoff_date: string;
}

const LocationWiseSearchPage = ({ location }: { location: string }) => {
  const { filters, setFilters } = useBikeRental();
  const { searchState } = useSearch();

  const searchParams: SearchParams = {
    city: searchState.city,
    pickup_date: searchState.pickupDateTime.toISOString(),
    dropoff_date: searchState.dropoffDateTime.toISOString(),
  };

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const {
    data: bikes = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Bike[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/bike/search`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const handlePackageChange = (duration: string) => {
    const newFilters: FilterState = {
      ...filters,
      duration: duration.toLowerCase(),
    };
    setFilters(newFilters);

    toast.success(`Search updated for ${duration} rental`, {
      id: "package-toast",
    });
  };

  if (error) return <div>Failed to load bikes</div>;
  if (isLoading) return <Spinner />;

  // Group bikes by name and collect all locations for each bike
  const groupedBikes = bikes.reduce((acc, bike) => {
    // Create a unique key using bike name and type to group identical bikes
    const key = `${bike.name}-${bike.type}`;

    if (!acc[key]) {
      acc[key] = {
        ...bike,
        locations: [{ value: bike.city, label: bike.area }],
      };
    } else {
      // Add new location if it doesn't exist
      const locationExists = acc[key].locations.some(
        (loc) => loc.value === bike.city && loc.label === bike.area
      );
      if (!locationExists) {
        acc[key].locations.push({ value: bike.city, label: bike.area });
      }
    }
    return acc;
  }, {});

  const filteredBikes = Object.values(groupedBikes).filter((bike: any) => {
    // Filter by transmission if any transmission filters are selected
    if (
      filters.transmission.length > 0 &&
      !filters.transmission.includes(bike.type.toLowerCase())
    ) {
      return false;
    }

    // Filter by branch if any branches are selected (case-insensitive)
    if (
      filters.branch.length > 0 &&
      !bike.locations.some((location) =>
        filters.branch.some(
          (branch) => location.label.toLowerCase() === branch.toLowerCase()
        )
      )
    ) {
      return false;
    }

    // Filter by brand if any brands are selected
    if (
      filters.brand.length > 0 &&
      !filters.brand.some((brand) =>
        bike.name.toLowerCase().includes(brand.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto border mt-10">
      <div className="flex flex-col">
        <Search
          variant="horizontal"
          duration={filters.duration}
          initialCity={location}
        />
        <div className="flex">
          <BikeFilters />
          <div className="p-3 flex flex-wrap gap-4">
            {filteredBikes.map((bike: any) => (
              <BikeCard
                key={`${bike.serial}`}
                title={bike.name}
                description={{
                  transmission: bike.type,
                  seatingCapacity: `${bike.seat} Seater`,
                  fuelType: bike.fuel || "Not specified",
                }}
                imageSrc={`${process.env.NEXT_PUBLIC_IMAGE_PATH}${bike.image}`}
                packages={[
                  {
                    duration: "Daily",
                    pricePerDay: bike.day_price,
                    distanceIncluded: `${bike.limit}`,
                  },
                  {
                    duration: "Weekly",
                    pricePerDay: bike.seven_day_price,
                    distanceIncluded: `${bike.limit}`,
                  },
                  {
                    duration: "15 Days",
                    pricePerDay: bike.fifteen_day_price,
                    distanceIncluded: `${bike.limit}`,
                  },
                  {
                    duration: "Monthly",
                    pricePerDay: bike.month_price,
                    distanceIncluded: `${bike.limit}`,
                  },
                ]}
                deposit={bike.deposit}
                makeYear={bike.make_year}
                locations={bike.locations}
                onPackageChange={handlePackageChange}
              />
            ))}
            {filteredBikes.length === 0 && (
              <div className="w-full text-center py-10">
                <p className="text-lg text-gray-500">
                  No bikes available for the selected criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationWiseSearchPage;
