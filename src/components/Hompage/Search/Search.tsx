// Import necessary dependencies
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6"; // Location icon
import DateTimePicker from "./DateTimePicker"; // Custom date/time picker component
import CityModal from "./CityModal"; // Modal for city selection
import { useRouter } from "next/navigation";
import { addHours, differenceInHours } from "date-fns"; // Date manipulation utilities
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; // Toast notifications
import { useSearch } from "@/context/SearchContext"; // Search context for state management

// Props interface for Search component
interface SearchProps {
  variant?: "vertical" | "horizontal"; // Layout variant
  className?: string; // Additional CSS classes
  duration?: string; // Rental duration
  onSearch?: (params: {
    // Search callback
    city: string;
    pickup_date: Date;
    dropoff_date: Date;
  }) => void;
  initialCity?: string; // Pre-selected city
}

// Main Search component for bike rental search functionality
const Search = ({
  variant = "vertical",
  className = "",
  duration: externalDuration,
  onSearch,
  initialCity,
}: SearchProps) => {
  // Get search state from context
  const { searchState } = useSearch();

  // State for managing active popover (pickup/dropoff date selector)
  const [activePopover, setActivePopover] = useState<
    "pickup" | "dropoff" | null
  >(null);

  // State for city modal visibility
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  // console.log(searchState.city);

  // State for selected city and duration
  const [selectedCity, setSelectedCity] = useState(
    initialCity || searchState.city || "Select City"
  );
  const [selectedDuration, setSelectedDuration] = useState(
    externalDuration || "daily"
  );

  // Calculate default times for pickup/dropoff
  const now = new Date();
  const nextHour = addHours(now, 1);
  const defaultPickupTime = `${nextHour.getHours() % 12 || 12} ${
    nextHour.getHours() < 12 ? "AM" : "PM"
  }`;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const defaultDropoffTime = `${nextHour.getHours() % 12 || 12} ${
    nextHour.getHours() < 12 ? "AM" : "PM"
  }`;

  // States for pickup/dropoff dates and times
  const [pickupDate, setPickupDate] = useState<Date>(
    searchState.pickupDateTime || now
  );
  const [pickupTime, setPickupTime] = useState<string>(
    searchState.pickupDateTime
      ? `${searchState.pickupDateTime.getHours() % 12 || 12} ${
          searchState.pickupDateTime.getHours() < 12 ? "AM" : "PM"
        }`
      : defaultPickupTime
  );

  const [dropoffDate, setDropoffDate] = useState<Date>(
    searchState.dropoffDateTime || now
  );

  // console.log(searchState.dropoffDateTime);
  // console.log(dropoffDate);

  const [dropoffTime, setDropoffTime] = useState<string>(
    searchState.dropoffDateTime
      ? `${searchState.dropoffDateTime.getHours() % 12 || 12} ${
          searchState.dropoffDateTime.getHours() < 12 ? "AM" : "PM"
        }`
      : defaultDropoffTime
  );

  // Calculate and store rental duration
  const initialTimeDiffInHours = differenceInHours(tomorrow, now);
  const [duration, setDuration] = useState(
    searchState.duration || {
      days: Math.floor(initialTimeDiffInHours / 24),
      hours: initialTimeDiffInHours % 24,
    }
  );

  const router = useRouter();
  // Get context update functions
  const {
    updateCity,
    updatePickupDateTime,
    updateDropoffDateTime,
    updateDuration,
  } = useSearch();

  // Handler for city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    updateCity(city);
  };

  // Helper function to convert time string to hours
  function getHoursFromTime(timeStr: string) {
    const [hourStr, period] = timeStr.split(" ");
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour;
  }

  // Handler for pickup date/time changes
  const handlePickupDateChange = (date: Date) => {
    setPickupDate(date);
    console.log("handlePickupDateChange");
    const hour = getHoursFromTime(pickupTime);
    const newPickupDateTime = new Date(date);
    newPickupDateTime.setHours(hour, 0, 0, 0);
    updatePickupDateTime(newPickupDateTime);

    // Set dropoff date to 24 hours later
    const newDropoffDateTime = new Date(newPickupDateTime);
    newDropoffDateTime.setDate(newPickupDateTime.getDate() + 1);
    setDropoffDate(newDropoffDateTime);
    updateDropoffDateTime(newDropoffDateTime);
  };

  const handlePickupTimeChange = (time: string) => {
    setPickupTime(time);
    console.log("handlePickupTimeChange");
    const hour = getHoursFromTime(time);
    const newPickupDateTime = new Date(pickupDate);
    newPickupDateTime.setHours(hour, 0, 0, 0);
    updatePickupDateTime(newPickupDateTime);

    // Set dropoff time to same time next day
    const newDropoffDateTime = new Date(pickupDate);
    newDropoffDateTime.setDate(newPickupDateTime.getDate() + 1);
    newDropoffDateTime.setHours(hour, 0, 0, 0);
    setDropoffDate(newDropoffDateTime);
    setDropoffTime(time);
    updateDropoffDateTime(newDropoffDateTime);

    console.log();
  };

  // Handler for dropoff date/time changes
  const handleDropoffDateChange = (date: Date) => {
    setDropoffDate(date);
    console.log("handleDropoffDateChange");

    const hour = getHoursFromTime(dropoffTime);
    const newDateTime = new Date(date);
    newDateTime.setHours(hour, 0, 0, 0);
    updateDropoffDateTime(newDateTime);
  };

  const handleDropoffTimeChange = (time: string) => {
    setDropoffTime(time);
    console.log("handleDropoffTimeChange");

    const hour = getHoursFromTime(time);
    const newDateTime = new Date(dropoffDate);
    newDateTime.setHours(hour, 0, 0, 0);
    updateDropoffDateTime(newDateTime);
  };

  // Handler for form submission
  const handleSubmit = async () => {
    if (selectedCity === "Select City") {
      toast.error("Please select a city first");
      return;
    }

    router.push(`/${selectedCity}/bike-rentals/search`);
  };

  // Effect to update duration when dates/times change
  useEffect(() => {
    if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      return;
    }

    const pickupHour = getHoursFromTime(pickupTime);
    const dropoffHour = getHoursFromTime(dropoffTime);

    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(pickupHour, 0, 0, 0);

    const dropoffDateTime = new Date(dropoffDate);
    dropoffDateTime.setHours(dropoffHour, 0, 0, 0);

    const timeDiffInHours = Math.floor(
      (dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)
    );

    const newDuration = {
      days: Math.floor(timeDiffInHours / 24),
      hours: timeDiffInHours % 24,
    };

    setDuration(newDuration);
    updateDuration(newDuration.days, newDuration.hours);
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime]);

  // Update local state when searchState changes
  useEffect(() => {
    setSelectedCity(searchState.city);
    setPickupDate(searchState.pickupDateTime);
    setDropoffDate(searchState.dropoffDateTime);

    // Update pickup time
    const newPickupTime = `${
      searchState.pickupDateTime.getHours() % 12 || 12
    } ${searchState.pickupDateTime.getHours() < 12 ? "AM" : "PM"}`;
    setPickupTime(newPickupTime);

    // Update dropoff time
    const newDropoffTime = `${
      searchState.dropoffDateTime.getHours() % 12 || 12
    } ${searchState.dropoffDateTime.getHours() < 12 ? "AM" : "PM"}`;
    setDropoffTime(newDropoffTime);

    // Update duration
    setDuration(searchState.duration);
  }, [searchState]);

  // Vertical layout component
  const verticalLayout = (
    <div
      className={`shadow-2xl bg-secondary p-6 rounded-md space-y-5 ${className}`}
    >
      <div className="space-y-2">
        <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
          Commuting Made Easy
        </h1>
        <p className="font-medium text-sm md:text-base lg:text-lg">
          Scooter/Scooty/Bike on Rent in{" "}
          {selectedCity === "Select City" ? "India" : selectedCity}
        </p>
      </div>

      <div
        className="flex flex-row justify-between items-center border p-4 hover:cursor-pointer rounded-md"
        onClick={() => setIsCityModalOpen(true)}
      >
        <p className="font-bold text-gray-400">
          {selectedCity || "Select City"}
        </p>
        <FaLocationDot />
      </div>

      <DateTimePicker
        message="Pickup Date & Time"
        storageKey="pickupTime"
        isOpen={activePopover === "pickup"}
        onOpenChange={(open) => setActivePopover(open ? "pickup" : null)}
        onTimeSelected={() => setActivePopover("dropoff")}
        currentPicker="pickup"
        pickupDate={pickupDate}
        pickupTime={pickupTime}
        onPickupDateChange={handlePickupDateChange}
        onPickupTimeChange={handlePickupTimeChange}
        dropoffDate={dropoffDate}
        dropoffTime={dropoffTime}
        onDropoffDateChange={handleDropoffDateChange}
        onDropoffTimeChange={handleDropoffTimeChange}
      />

      <DateTimePicker
        message="Dropoff Date & Time"
        storageKey="dropoffTime"
        isOpen={activePopover === "dropoff"}
        onOpenChange={(open) => setActivePopover(open ? "dropoff" : null)}
        currentPicker="dropoff"
        pickupDate={pickupDate}
        pickupTime={pickupTime}
        onPickupDateChange={handlePickupDateChange}
        onPickupTimeChange={handlePickupTimeChange}
        dropoffDate={dropoffDate}
        dropoffTime={dropoffTime}
        onDropoffDateChange={handleDropoffDateChange}
        onDropoffTimeChange={handleDropoffTimeChange}
      />

      <p className="text-gray-400">
        Duration:{" "}
        {duration.days > 0
          ? `${duration.days} ${duration.days === 1 ? "Day" : "Days"}`
          : ""}
        {duration.hours > 0
          ? `${duration.hours} ${duration.hours === 1 ? "Hour" : "Hours"}`
          : ""}
      </p>

      <Button
        type="submit"
        onClick={handleSubmit}
        className="px-12 py-6 text-xl font-semibold w-full"
      >
        Search
      </Button>
    </div>
  );

  // Horizontal layout component
  const horizontalLayout = (
    <Card className={`rounded-none border-b p-4 w-full ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div
            className="flex justify-between items-center border p-3 hover:cursor-pointer rounded-md"
            onClick={() => setIsCityModalOpen(true)}
          >
            <p className="font-bold text-sm pr-1 text-gray-400">
              {selectedCity || "Select City"}
            </p>
            <FaLocationDot />
          </div>
        </div>

        <div className="flex-1 flex gap-4">
          <DateTimePicker
            message="Pickup Date & Time"
            storageKey="pickupTime"
            isOpen={activePopover === "pickup"}
            onOpenChange={(open) => setActivePopover(open ? "pickup" : null)}
            onTimeSelected={() => setActivePopover("dropoff")}
            currentPicker="pickup"
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            onPickupDateChange={handlePickupDateChange}
            onPickupTimeChange={handlePickupTimeChange}
            dropoffDate={dropoffDate}
            dropoffTime={dropoffTime}
            onDropoffDateChange={handleDropoffDateChange}
            onDropoffTimeChange={handleDropoffTimeChange}
          />

          <DateTimePicker
            message="Dropoff Date & Time"
            storageKey="dropoffTime"
            isOpen={activePopover === "dropoff"}
            onOpenChange={(open) => setActivePopover(open ? "dropoff" : null)}
            currentPicker="dropoff"
            pickupDate={pickupDate}
            pickupTime={pickupTime}
            onPickupDateChange={handlePickupDateChange}
            onPickupTimeChange={handlePickupTimeChange}
            dropoffDate={dropoffDate}
            dropoffTime={dropoffTime}
            onDropoffDateChange={handleDropoffDateChange}
            onDropoffTimeChange={handleDropoffTimeChange}
          />
        </div>

        <Button
          type="submit"
          onClick={handleSubmit}
          className="flex-shrink-0"
          size="lg"
        >
          Search
        </Button>
      </div>
    </Card>
  );

  // Render appropriate layout with city modal
  return (
    <>
      {variant === "vertical" ? verticalLayout : horizontalLayout}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onCitySelect={handleCitySelect}
      />
    </>
  );
};

export default Search;
