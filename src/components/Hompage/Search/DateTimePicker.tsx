"use client";
import React, { useState, useEffect } from "react";
import {
  format,
  isBefore,
  startOfTomorrow,
  startOfToday,
  addHours,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { FaLocationDot } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DateTimePickerProps {
  message: string;
  storageKey: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeSelected?: () => void;
  currentPicker: string;
  pickupDate: Date;
  pickupTime: string;
  onPickupDateChange: (newDate: Date) => void;
  onPickupTimeChange: (newTime: string) => void;
  dropoffDate: Date;
  dropoffTime: string;
  onDropoffDateChange: (newDate: Date) => void;
  onDropoffTimeChange: (newTime: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  message,
  storageKey,
  isOpen,
  onOpenChange,
  onTimeSelected,
  currentPicker,
  pickupDate,
  pickupTime,
  onPickupDateChange,
  onPickupTimeChange,
  dropoffDate,
  dropoffTime,
  onDropoffDateChange,
  onDropoffTimeChange,
}) => {
  const currentDate = new Date(); // Get the current date and time
  const currentHour = currentDate.getHours(); // Get the current hour (0-23)
  const nextHour = currentHour ? (currentHour + 1) % 24 : undefined;
  const [month, setMonth] = useState<Date>(new Date());
  const [prevPickupDate, setPrevPickupDate] = useState<Date>(pickupDate);
  const [prevPickupTime, setPrevPickupTime] = useState<string>(pickupTime);

  useEffect(() => {
    if (currentPicker === "dropoff" && dropoffDate) {
      setMonth(dropoffDate);
    }
  }, []);

  useEffect(() => {
    if (
      currentPicker === "pickup" &&
      (pickupDate.getTime() !== prevPickupDate.getTime() ||
        pickupTime !== prevPickupTime)
    ) {
      const nextDay = new Date(pickupDate);
      nextDay.setDate(pickupDate.getDate() + 1);

      // Only update if the values are actually different
      if (
        dropoffDate.getTime() !== nextDay.getTime() ||
        dropoffTime !== pickupTime
      ) {
        //console.log(currentPicker," updated to next day");

        onDropoffDateChange(nextDay);
        onDropoffTimeChange(pickupTime);
      }

      setPrevPickupDate(pickupDate);
      setPrevPickupTime(pickupTime);
    }
  }, [pickupDate, pickupTime, currentPicker]);

  function convertToHourObject(timeString: string) {
    const [hourStr, period] = timeString.split(" ");
    let hour = parseInt(hourStr, 10);

    if (period === "PM" && hour !== 12) {
      hour += 12; // Convert PM hours to 24-hour format
    } else if (period === "AM" && hour === 12) {
      hour = 0; // Handle midnight
    }

    return { hour };
  }

  const pickupTimeHour = convertToHourObject(pickupTime).hour;

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    return {
      label: `${hour} ${ampm}`,
      hour: i,
    };
  }).filter((slot) => {
    if (currentPicker === "pickup") {
      if (pickupDate && pickupDate.getDate() !== startOfToday().getDate())
        return true;
      return currentHour < slot.hour;
    } else {
      if (dropoffDate && dropoffDate.getDate() !== pickupDate.getDate())
        return true;
      return pickupTimeHour < slot.hour;
    }
  });

  return (
    <div className="w-full h-full">
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-row justify-between items-center border p-4 hover:cursor-pointer w-full h-full">
                    <p className="font-bold text-gray-400">
                      {currentPicker === "pickup"
                        ? pickupDate && pickupTime
                          ? `${format(pickupDate, "PPP")} at ${pickupTime}`
                          : `Select ${message}`
                        : dropoffDate && dropoffTime
                        ? `${format(dropoffDate, "PPP")} at ${dropoffTime}`
                        : `Select ${message}`}
                    </p>
                    <MdDateRange />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p>Select {message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <p className="font-bold text-xl text-primary">{message}</p>
            <div className="flex">
              {/* Calender part */}
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={currentPicker === "pickup" ? pickupDate : dropoffDate}
                onSelect={(newDate) => {
                  if (newDate) {
                    if (currentPicker === "pickup") {
                      onPickupDateChange(newDate);
                    } else {
                      onDropoffDateChange(newDate);
                    }
                    setMonth(newDate); // Update the displayed month when a date is selected
                  }
                }}
                disabled={(date) => {
                  if (
                    currentPicker === "pickup" ||
                    pickupDate.getDate() === startOfToday().getDate()
                  ) {
                    return isBefore(date, startOfToday());
                  } else {
                    if (date.getDate() === pickupDate.getDate()) {
                      return false;
                    } else {
                      return isBefore(date, pickupDate);
                    }
                  }
                }}
                modifiers={{ today: new Date() }}
                modifiersClassNames={{
                  today: "", // Remove custom-today class so today has same style
                }}
                showOutsideDays={true}
                classNames={{
                  day_outside:
                    "text-white hover:bg-accent hover:text-accent-foreground",
                }}
                className="rounded-l-md border"
              />

              {/* Time slots */}
              <div className="h-[300px] overflow-y-auto border rounded-r-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <ul
                  className="divide-y"
                  ref={(listRef) => {
                    if (listRef) {
                      // Find the selected time slot element
                      const selectedItem = Array.from(listRef.children).find(
                        (child) => {
                          const time = child.textContent;
                          return currentPicker === "pickup"
                            ? time === pickupTime
                            : time === dropoffTime;
                        }
                      );

                      // Scroll to the selected item
                      if (selectedItem) {
                        selectedItem.scrollIntoView({
                          block: "center",
                          behavior: "auto",
                        });
                      }
                    }
                  }}
                >
                  {timeSlots.map((time) => (
                    <li
                      key={time.label}
                      className={`px-4 py-2 cursor-pointer hover:bg-primary ${
                        (
                          currentPicker === "pickup"
                            ? pickupTime === time.label
                            : dropoffTime === time.label
                        )
                          ? "bg-primary"
                          : ""
                      }`}
                      onClick={() => {
                        currentPicker === "pickup"
                          ? onPickupTimeChange(time.label)
                          : onDropoffTimeChange(time.label);

                        onOpenChange(false);
                        onTimeSelected?.();
                      }}
                    >
                      {time.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;
