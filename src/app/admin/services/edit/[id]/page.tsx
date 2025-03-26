"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "@/components/Spinner/Spinner";
import { use } from "react";
import { Service } from "../../columns";

const serviceSchema = z.object({
   title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
   description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
   image: z.instanceof(File, { message: "Image is required" })
      .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .refine(
         (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
         "Only .jpg, .jpeg, .png and .webp formats are supported"
      )
      .optional()
});

export default function EditServicePage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [formData, setFormData] = useState<Partial<Service>>({
      title: "",
      description: "",
      image: "",
   });
   const [errors, setErrors] = useState<{ [key: string]: string }>({});

   useEffect(() => {
      // Mock fetch function - replace with actual API call
      const fetchService = async () => {
         try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setFormData({
               id: parseInt(resolvedParams.id),
               title: "Sample Service",
               description: "This is a sample service description",
               image: "/api/placeholder/150/150"
            });
         } catch (error) {
            console.error("Error fetching service:", error);
            toast.error("Failed to fetch service details");
         } finally {
            setLoading(false);
         }
      };

      fetchService();
   }, [resolvedParams.id]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
         serviceSchema.parse({
            ...formData,
            image: formData.image instanceof File ? formData.image : undefined
         });
      } catch (error) {
         if (error instanceof z.ZodError) {
            const formattedErrors: { [key: string]: string } = {};
            error.errors.forEach((err) => {
               if (err.path) {
                  formattedErrors[err.path[0]] = err.message;
               }
            });
            setErrors(formattedErrors);
            return;
         }
      }

      setSubmitting(true);

      try {
         // Mock update function - replace with actual API call
         await new Promise(resolve => setTimeout(resolve, 1000));
         toast.success("Service updated successfully");
         router.push("/admin/services");
         router.refresh();
      } catch (error) {
         console.error("Error updating service:", error);
         toast.error("Failed to update service");
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) return <Spinner />;

   return (
      <div className="max-w-2xl mx-auto py-10">
         <Card>
            <CardHeader>
               <CardTitle>Edit Service</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="title">Service Title</Label>
                        <Input
                           id="title"
                           value={formData.title}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                           <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                     </div>

                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                           id="description"
                           value={formData.description}
                           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                           className={errors.description ? "border-red-500" : ""}
                           rows={4}
                        />
                        {errors.description && (
                           <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                     </div>

                     <div>
                        <Label htmlFor="image">Service Image</Label>
                        <Input
                           id="image"
                           type="file"
                           onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                           className={`cursor-pointer ${errors.image ? "border-red-500" : ""}`}
                        />
                        {formData.image && typeof formData.image === 'string' && (
                           <img
                              src={formData.image}
                              alt={formData.title}
                              className="mt-2 w-32 h-32 object-cover rounded-md"
                           />
                        )}
                        {errors.image && (
                           <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Service"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
