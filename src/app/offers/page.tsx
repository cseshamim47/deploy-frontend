"use client";
import Title from "@/components/ui/Title";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Offer } from "@/utils/types";
import Spinner from "@/components/Spinner/Spinner";
import dayjs from 'dayjs'; // Import dayjs for date formatting

const Offers = () => {
  const { data, error } = useSWR<Offer[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/offer`,
    fetcher
  );
  if (error) return <div className="mt-20">Failed to load</div>;
  if (!data) {
    return <Spinner /> // Loading state
  }

   const formatDate = (dateString: string) => {
      if (!dateString) return ""; // Handle cases where date is missing

      try {
         const formattedDate = dayjs(dateString).format('DD/MM/YYYY');
         return formattedDate;
      } catch (error) {
         console.error("Error formatting date:", error);
         return "Invalid Date"; // Or a suitable default
      }
   };


  return (
    <div className="mt-10 space-y-10">
      <Title title="Offers for You" description="" showText={false} />
      {!data?.length && <p>No offers available</p>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {data?.map((offer) => (
          <Card className="bg-secondary py-4" key={offer.id}>
            <CardHeader>
              <div className="flex flex-row justify-between items-center">
                <CardTitle>{offer.title}</CardTitle>
                <Image
                  src="/images/offers/logo-small.png"
                  alt="Card Image"
                  height={50}
                  width={50}
                />
              </div>
              <CardDescription>{offer.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={`http://localhost:3001/static/${offer.image}`}
                alt="Offer Image"
                height={200}
                width={300}
              />
            </CardContent>
            <CardFooter>
              <div className="w-full text-center">
                    <div className="py-4 px-6 bg-background border border-dashed flex flex-col items-center"> {/* Added flex and flex-col */}
                       <span>{offer.coupon}</span>
                       {offer.coupon_expiry && ( // Conditionally render expiry
                          <span className="text-sm mt-1">
                             Valid until {formatDate(offer.coupon_expiry)}
                          </span>
                       )}
                    </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Offers;
