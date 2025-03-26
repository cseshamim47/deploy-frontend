"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const serviceSchema = z.object({
   title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
   description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
   image: z.instanceof(File, { message: "Image is required" })
      .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .refine(
         (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
         "Only .jpg, .jpeg, .png and .webp formats are supported"
      )
});

export default function AddServicePage() {
   const router = useRouter();
   const [isMutating, setIsMutating] = useState(false);
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null as File | null,
   });
   const [errors, setErrors] = useState<{ [key: string]: string }>({});

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
         serviceSchema.parse({
            ...formData,
            image: formData.image as File
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

      setIsMutating(true);

      try {
         // Mock API call - replace with actual implementation
         await new Promise(resolve => setTimeout(resolve, 1000));
         toast.success("Service added successfully");
         router.push("/admin/services");
      } catch (error) {
         console.error("Failed to add service:", error);
         toast.error("Failed to add service");
      } finally {
         setIsMutating(false);
      }
   };

   return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
         <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
         >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
         </Button>

         <Card className="bg-secondary">
            <CardHeader>
               <CardTitle>Add New Service</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
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
                        {errors.image && (
                           <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                     </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isMutating}>
                        {isMutating ? "Adding..." : "Add Service"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
