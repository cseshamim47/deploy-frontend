import React from "react";
import Title from "../ui/Title";

const contents = [
  {
    title: "Find your Ride",
    description:
      "Enter the basic details like, city, pick up and drop date and time to choose from a list of available two - wheelers at your desired go-hub.",
  },
  {
    title: "Book your Ride",
    description:
      "Select your package and choose from the available payment options.",
  },
  {
    title: "Get Ready to Ride",
    description:
      "You will receive all the ride details via message and email. Reach the pick up point in time and pay the security deposit (if applicable). Enjoy every moment of your ride.",
  },
  {
    title: "End your Ride",
    description:
      "Once you have had the time of your life, drop the vehicle at the same pick up point. Security deposit is refunded after checking for damages and challans (if any).",
  },
];

const HowToBook = () => {
  return (
    <div className="grid md:grid-cols-2">
      <div className="hidden md:block"></div>
      <div className="space-y-8">
        <Title
          title="How to Book Your Ride?"
          description="Book your dream ride in just four simple steps"
          showText={true}
        />

        <div>
          {contents.map((content, index) => (
            <div
              key={index}
              className={`relative pl-8 ${
                index !== contents.length - 1 &&
                "border-l-2 border-dashed pb-10"
              }`}
            >
              <span className="absolute top-0 -left-4 border w-8 h-8 font-bold rounded-full bg-primary flex items-center justify-center">
                {index + 1}
              </span>
              <h2 className="font-medium text-sm md:text-base lg:text-lg mb-2">
                {content.title}
              </h2>
              <p className="text-xs md:text-sm lg:text-base">
                {content.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToBook;
