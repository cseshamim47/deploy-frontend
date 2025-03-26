"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Spinner from "@/components/Spinner/Spinner";
import { z } from "zod";

const areaSchema = z.object({
   cityId: z.string().min(1, "City is required"),
   name: z.string()
      .min(2, "Area name must be at least 2 characters")
      .max(50, "Area name must be less than 50 characters"),
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AddAreaForm() {
   const router = useRouter();
   const { data: cities, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/city`, fetcher);
   const [cityId, setCityId] = useState("");
   const [areaName, setAreaName] = useState("");
   const [submitting, setSubmitting] = useState(false);
   const [errors, setErrors] = useState<{ cityId?: string; name?: string }>({});

   if (error) return <p className="text-red-500">Failed to load cities</p>;
   if (!cities) return <Spinner />;

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
         areaSchema.parse({ cityId, name: areaName });
         setSubmitting(true);

         // First, create the area in the database
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/area`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               city_id: parseInt(cityId),
               name: areaName
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create area');
         }

         // Revalidate the cities data to reflect the new area
         await mutate(`${process.env.NEXT_PUBLIC_API_URL}/city`);
         
         toast.success("Area added successfully to database");
         router.push("/admin/locations");
         router.refresh();
      } catch (error) {
         if (error instanceof z.ZodError) {
            setErrors(error.flatten().fieldErrors);
         } else {
            toast.error(error instanceof Error ? error.message : "Failed to create area");
         }
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="max-w-md mx-auto py-10">
         <Card className="bg-secondary">
            <CardHeader>
               <CardTitle>Add Area</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>Select City</Label>
                     <Select value={cityId} onValueChange={setCityId}>
                        <SelectTrigger className={errors.cityId ? "border-red-500" : ""}>
                           <SelectValue placeholder="Choose a city" />
                        </SelectTrigger>
                        <SelectContent>
                           {cities.map((city: any) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                 {city.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId}</p>}
                  </div>

                  <div>
                     <Label>Area Name</Label>
                     <Input
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        placeholder="Enter area name"
                        className={errors.name ? "border-red-500" : ""}
                     />
                     {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="flex gap-4">
                     <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                     <Button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Area"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
