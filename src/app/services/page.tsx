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
import { Service } from "@/utils/types";
import Spinner from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";

const Services = () => {
  const { data: apiResponse, error } = useSWR<Service[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/service`,
    fetcher
  );

  console.log("API Response Data:", apiResponse);
  console.log(error);
  
  if (error) return <div className="mt-20">Failed to load</div>;
  if (!apiResponse) {
    return <Spinner />; // Loading state
  }

  // Ensure data is an array
  const services: Service[] = Array.isArray(apiResponse) ? apiResponse : [];

  return (
    <div className="mt-10 space-y-10">
      <Title title="Services we provide" description="" showText={false} />
      {!services?.length && <p>No services available</p>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {services?.map((service: Service) => (
          <Card className="bg-secondary py-4" key={service.id}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={`http://localhost:3001/static/${service.image}`}
                alt="Service Image"
                height={200}
                width={300}
              />
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Button>Contact Us</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
