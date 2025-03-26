"use client";
import { useParams } from "next/navigation";
import LocationWiseSearchPage from "@/components/Bike/LocationWiseSearchPage";
import Search from "@/components/Hompage/Search/Search";

const SearchPage = () => {
  const params = useParams();
  const location = params.location as string;
  console.log("Search Page Called");

  // Ensure proper case for location display
  const formattedLocation =
    location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();

  return (
    <div>
      <LocationWiseSearchPage location={formattedLocation} />
    </div>
  );
};

export default SearchPage;
