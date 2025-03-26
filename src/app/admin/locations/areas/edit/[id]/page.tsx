"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Spinner from "@/components/Spinner/Spinner";
import useSWR from "swr";
import { z } from "zod";
import { use } from "react"
const areaSchema = z.object({
   name: z.string().min(2, "Area name must be at least 2 characters").max(50, "Area name must be less than 50 characters"),
});

export default function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const router = useRouter();
   const [submitting, setSubmitting] = useState(false);
   const [formData, setFormData] = useState<{ id?: number; name: string }>({ name: "" });
   const [errors, setErrors] = useState<{ name?: string }>({});

   const fetcher = async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay
      return { id: parseInt(resolvedParams.id), name: "Sample Area" }; // Mock response
   };

   const { data, error, isLoading } = useSWR(`/api/areas/${resolvedParams.id}`, fetcher);

   useEffect(() => {
      if (data) setFormData(data);
   }, [data]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
         areaSchema.parse({ name: formData.name });
         setSubmitting(true);
         await new Promise(resolve => setTimeout(resolve, 1000)); // Mock update delay
         toast.success("Area updated successfully");
         router.push("/admin/locations");
         router.refresh();
      } catch (error) {
         if (error instanceof z.ZodError) {
            setErrors({ name: error.errors[0].message });
         } else {
            console.error("Error updating area:", error);
            toast.error("Failed to update area");
         }
      } finally {
         setSubmitting(false);
      }
   };

   if (isLoading) return <Spinner />;
   if (error) return <p className="text-red-500">Failed to load area details</p>;

   return (
      <div className="max-w-lg mx-auto py-10">
         <Card className="bg-secondary">
            <CardHeader>
               <CardTitle>Edit Area</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <Label htmlFor="name">Area Name</Label>
                     <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "border-red-500" : ""}
                     />
                     {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="flex gap-4">
                     <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Area"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
