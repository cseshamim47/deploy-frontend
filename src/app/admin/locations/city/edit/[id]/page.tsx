"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Spinner from "@/components/Spinner/Spinner";
import { z } from "zod";
import useSWR, { mutate } from "swr";
import { use } from "react";

const citySchema = z.object({
   name: z.string()
      .min(2, "City name must be at least 2 characters")
      .max(50, "City name must be less than 50 characters"),
   image: z.string().min(1, "Image is required"),
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EditCityPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const router = useRouter();
   const [submitting, setSubmitting] = useState(false);
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [formData, setFormData] = useState({ name: "", image: "" });
   const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

   // Fetch city data
   const { data: city, error } = useSWR(
      `${process.env.NEXT_PUBLIC_API_URL}/city/${resolvedParams.id}`,
      fetcher
   );

   // Set initial form data when city data is loaded
   useEffect(() => {
      if (city) {
         setFormData({
            name: city.name,
            image: city.image,
         });
      }
   }, [city]);

   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            setErrors({ image: "Only .jpg, .jpeg, .png and .webp formats are supported" });
            return;
         }
         if (file.size > 5 * 1024 * 1024) {
            setErrors({ image: "Image size should not exceed 5MB" });
            return;
         }
         setImageFile(file);
         setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
         setErrors({});
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      try {
         citySchema.parse(formData);
         setSubmitting(true);

         const formDataToSend = new FormData();
         formDataToSend.append('name', formData.name);
         if (imageFile) {
            formDataToSend.append('image', imageFile);
         }

         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/${resolvedParams.id}`, {
            method: 'PATCH',
            body: formDataToSend,
         });

         if (!response.ok) {
            throw new Error('Failed to update city');
         }

         // Revalidate the cities data
         await mutate(`${process.env.NEXT_PUBLIC_API_URL}/city`);
         
         toast.success("City updated successfully");
         router.push("/admin/locations");
         router.refresh();
      } catch (error) {
         if (error instanceof z.ZodError) {
            setErrors(error.flatten().fieldErrors);
         } else {
            toast.error("Failed to update city");
         }
      } finally {
         setSubmitting(false);
      }
   };

   if (error) return <div>Failed to load</div>;
   if (!city) return <Spinner />;

   return (
      <div className="max-w-2xl mx-auto py-10">
         <Card className="bg-secondary">
            <CardHeader>
               <CardTitle>Edit City</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="name">City Name</Label>
                        <Input
                           id="name"
                           value={formData.name}
                           onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                           className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                     </div>

                     <div>
                        <Label htmlFor="image">City Image</Label>
                        <Input
                           id="image"
                           type="file"
                           accept="image/jpeg,image/jpg,image/png,image/webp"
                           onChange={handleImageChange}
                           className={errors.image ? "border-red-500" : ""}
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        {formData.image && (
                           <div className="mt-2">
                              <img
                                 src={formData.image}
                                 alt={formData.name}
                                 className="w-32 h-32 object-cover rounded-md"
                              />
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update City"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
