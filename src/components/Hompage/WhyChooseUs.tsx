import React from "react";
import Image from "next/image";
import Title from "../ui/Title";

const contents = [
  {
    icon: "flexible-packages",
    title: "Different Flexible Packages",
    description:
      "Grab daily, weekly, fortnight and monthly packages at discounted rates",
  },
  {
    icon: "wide-range",
    title: "Wide Range",
    description:
      "Looking for a particular brand or location? We have probably got it.",
  },
  {
    icon: "well-maintained-fleet",
    title: "Highly Maintained Fleet",
    description: "Get high quality and serviced vehicles.",
  },
  {
    icon: "open-24-hours",
    title: "24*7 At Service",
    description: "Day or night, rent a bike",
  },
  {
    icon: "pay-later",
    title: "Book Now, Pay later",
    description: "Flexibility to decide when and how to pay.",
  },
  {
    icon: "instant-refund",
    title: "Instant Refund",
    description:
      "Facing an issue while booking/pick up? We initiate instant refund.",
  }
];

const WhyChooseUs = () => {
  return (
    <div className="grid md:grid-cols-2">
      <div className="hidden md:block"></div>
      <div className="space-y-8">
        <Title title="Why Choose Us" description="" showText={false} />
        <div className="grid grid-cols-2 gap-8">
          {contents.map((content, index) => (
            <div key={index} className="space-y-1">
              <Image
                src={`/images/why-choose-us/${content.icon}.svg`}
                alt={content.title}
                width={50}
                height={0}
                className="mb-3"
              />
              <h2 className="font-medium text-sm md:text-base lg:text-lg">{content.title}</h2>
              <p className="text-xs md:text-sm lg:text-base">{content.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
