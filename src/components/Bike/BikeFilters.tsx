import React, { useEffect } from "react";
import { FilterState } from "@/lib/types";
import { useBikeRental } from "@/context/BikeRentalContext";
import { useSearch } from "@/context/SearchContext";
import useSWR, { mutate } from "swr";

// Define the Area type based on your API response
interface Area {
  id: number;
  name: string;
  city_id: number;
}

interface City {
  id: number;
  name: string;
  areas: Area[];
}

const BikeFilters = () => {
  const { filters, setFilters } = useBikeRental();
  const { searchState, updateDropoffDateTime } = useSearch();

  const fetcher = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error details:", error);
      return null;
    }
  };

  // Fetch all cities to find the current city's data
  const { data: cities } = useSWR<City[]>(
    searchState.city ? `${process.env.NEXT_PUBLIC_API_URL}/city` : null,
    fetcher
  );

  // Find the current city and its areas
  const currentCity = cities?.find(
    (city) => city.name.toLowerCase() === searchState.city?.toLowerCase()
  );
  const areas = currentCity?.areas || [];

  const handleDurationChange = async (value: string) => {
    setFilters({ ...filters, duration: value });

    // Calculate days based on the selected package
    let days = 0;
    switch (value) {
      case "daily":
        days = 1;
        break;
      case "7days":
        days = 7;
        break;
      case "15days":
        days = 15;
        break;
      case "monthly":
        days = 30;
        break;
      case "3months":
        days = 90;
        break;
      case "6months":
        days = 180;
        break;
      case "yearly":
        days = 365;
        break;
    }

    // Calculate new dropoff date based on pickup date and duration
    const newDropoffDate = new Date(searchState.pickupDateTime);
    newDropoffDate.setDate(searchState.pickupDateTime.getDate() + days);

    // Update the dropoff date in the context
    updateDropoffDateTime(newDropoffDate);

    // Trigger a new search with updated parameters
    try {
      const searchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bike/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: searchState.city,
            pickup_date: searchState.pickupDateTime.toISOString(),
            dropoff_date: newDropoffDate.toISOString(),
          }),
        }
      );

      if (!searchResponse.ok) {
        throw new Error("Search failed");
      }

      const searchData = await searchResponse.json();
      // Manually update the SWR cache with new search results
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/bike/search`, searchData);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    if (category === "duration") return;

    const currentValues = filters[category];
    const newValues = Array.isArray(currentValues)
      ? currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      : [value];

    setFilters({ ...filters, [category]: newValues });
  };

  // Transmission type options
  const transmissionTypes = [
    { id: "gear", label: "Gear" },
    { id: "automatic", label: "Automatic" },
  ];

  // Brand options
  const brandOptions = [
    { id: "honda", label: "Honda" },
    { id: "yamaha", label: "Yamaha" },
    { id: "suzuki", label: "Suzuki" },
    { id: "royal-enfield", label: "Royal Enfield" },
  ];

  return (
    <div className="border-r p-10">
      <h2 className="font-semibold text-2xl">Filters</h2>

      <div className="py-5 border-b">
        <p>BOOKING DURATION</p>
        <div className="flex flex-col gap-2 mt-2 text-sm">
          {[
            { id: "daily", label: "Daily Package" },
            { id: "7days", label: "Weekly Package" },
            { id: "15days", label: "15 Days Package" },
            { id: "monthly", label: "Monthly Package" },
            { id: "3months", label: "3 Months Package" },
            { id: "6months", label: "6 Months Package" },
            { id: "yearly", label: "Yearly Package" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={id}
                name="package"
                value={id}
                checked={filters.duration === id}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-4 h-4 hover:cursor-pointer"
              />
              <label htmlFor={id} className="hover:cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="py-5 border-b">
        <p>TRANSMISSION TYPE</p>
        <div className="flex flex-col space-y-2 text-sm">
          {transmissionTypes.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`transmission-${id}`}
                checked={filters.transmission.includes(id)}
                onChange={() => handleCheckboxChange("transmission", id)}
                className="w-4 h-4 hover:cursor-pointer"
              />
              <label
                htmlFor={`transmission-${id}`}
                className="hover:cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="py-5 border-b">
        <p>Branch</p>
        <div className="flex flex-col space-y-2 text-sm">
          {areas.length > 0 ? (
            areas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`branch-${area.id}`}
                  checked={filters.branch.includes(area.name)}
                  onChange={() => handleCheckboxChange("branch", area.name)}
                  className="w-4 h-4 hover:cursor-pointer"
                />
                <label
                  htmlFor={`branch-${area.id}`}
                  className="hover:cursor-pointer"
                >
                  {area.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No branches available in {searchState.city || "this city"}
            </p>
          )}
        </div>
      </div>

      <div className="py-5">
        <p>Brands</p>
        <div className="flex flex-col space-y-2 text-sm">
          {brandOptions.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`brand-${id}`}
                checked={filters.brand.includes(id)}
                onChange={() => handleCheckboxChange("brand", id)}
                className="w-4 h-4 hover:cursor-pointer"
              />
              <label htmlFor={`brand-${id}`} className="hover:cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BikeFilters;
