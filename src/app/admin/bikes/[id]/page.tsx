"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bike } from "../columns";
import Spinner from "@/components/Spinner/Spinner";
import { use } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function BikeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bike, setBike] = useState<Bike | null>(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bike/${resolvedParams.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch bike");
        const data = await response.json();
        setBike(data);
      } catch (error) {
        console.error("Error fetching bike:", error);
        toast.error("Failed to fetch bike details");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [resolvedParams.id]);

  if (loading) return <Spinner />;
  if (!bike) return <div>Bike not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{bike.name}</CardTitle>
              <CardDescription>Bike Details</CardDescription>
            </div>
            <Button onClick={() => router.push(`/admin/bikes/edit/${bike.id}`)}>
              Edit Bike
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Section */}
          {bike.image && (
            <div className="relative w-full h-[400px]">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/bike/${bike.image}`}
                alt={bike.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Type:</span> {bike.type}
                </p>
                <p>
                  <span className="font-medium">Seats:</span> {bike.seat}
                </p>
                <p>
                  <span className="font-medium">Make Year:</span>{" "}
                  {bike.make_year}
                </p>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Pricing</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Daily Price:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(bike.day_price)}
                </p>
                <p>
                  <span className="font-medium">Weekly Price:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(bike.seven_day_price)}
                </p>
                <p>
                  <span className="font-medium">15 Days Price:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(bike.fifteen_day_price)}
                </p>
                <p>
                  <span className="font-medium">Monthly Price:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(bike.month_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Usage Terms</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Distance Limit:</span>{" "}
                  {bike.limit} km
                </p>
                <p>
                  <span className="font-medium">Extra Charge:</span> ₹
                  {bike.extra}
                  /km
                </p>
                <p>
                  <span className="font-medium">Security Deposit:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(bike.deposit)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
