"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

// API mutation function for SWR
async function addBike(url: string, { arg }: { arg: FormData }) {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!response.ok) {
    throw new Error("Failed to add bike");
  }

  return response.json();
}

export default function AddBikePage() {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/bike`,
    addBike
  );
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    city: "",
    area: "",
    day_price: "",
    seven_day_price: "",
    fifteen_day_price: "",
    month_price: "",
    limit: "",
    extra: "",
    deposit: "",
    make_year: "",
    image: null as File | null,
    serial: "", // Added serial field
  });
  
  const { data: cities } = useSWR<{ id: number; name: string }[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/city`,
    fetcher
  );

  const { data: areas = [] } = useSWR<{ id: number; name: string; city_id: number }[]>(
    formData.city ? `${process.env.NEXT_PUBLIC_API_URL}/area/city/name/${formData.city}` : null,
    fetcher
  );


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.type === "file"
        ? (e.target as HTMLInputElement).files?.[0] || null
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      await trigger(formDataToSend);
      router.push("/admin/bikes");
    } catch (error) {
      console.error("Failed to add bike:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bikes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Bike</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input
                    id="serial"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    name="type"
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bike type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mountain">Mountain</SelectItem>
                      <SelectItem value="road">Road</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="make_year">Make Year</Label>
                  <Input
                    id="make_year"
                    name="make_year"
                    type="number"
                    value={formData.make_year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleChange}
                    required
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select
                    name="city"
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value, area: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select
                    name="area"
                    onValueChange={(value) =>
                      setFormData({ ...formData, area: value })
                    }
                    disabled={!formData.city}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(areas) && areas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="day_price">Daily Price</Label>
                    <Input
                      id="day_price"
                      name="day_price"
                      type="number"
                      value={formData.day_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="seven_day_price">Weekly Price</Label>
                    <Input
                      id="seven_day_price"
                      name="seven_day_price"
                      type="number"
                      value={formData.seven_day_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fifteen_day_price">15 Day Price</Label>
                    <Input
                      id="fifteen_day_price"
                      name="fifteen_day_price"
                      type="number"
                      value={formData.fifteen_day_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="month_price">Monthly Price</Label>
                    <Input
                      id="month_price"
                      name="month_price"
                      type="number"
                      value={formData.month_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deposit">Deposit</Label>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      value={formData.deposit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="limit">Limit</Label>
                  <Input
                    id="limit"
                    name="limit"
                    type="number"
                    value={formData.limit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="extra">Extra</Label>
                  <Input
                    id="extra"
                    name="extra"
                    type="number"
                    value={formData.extra}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Adding..." : "Add Bike"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
