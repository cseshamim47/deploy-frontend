"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { z } from "zod"
import Spinner from "@/components/Spinner/Spinner"
import { use } from "react"

const bikeSchema = z.object({
   name: z.string().min(2, "Name must be at least 2 characters"),
   type: z.string().min(1, "Type is required"),
   seat: z.string().min(1, "Seat information is required"),
   oil: z.string().min(1, "Oil information is required"),
   city: z.string().min(1, "City is required"),
   area: z.string().min(1, "Area is required"),
   day_price: z.string().min(1, "Daily price is required"),
   seven_day_price: z.string().min(1, "Weekly price is required"),
   fifteen_day_price: z.string().min(1, "15-day price is required"),
   month_price: z.string().min(1, "Monthly price is required"),
   limit: z.string().min(1, "Limit is required"),
   extra: z.string().min(1, "Extra information is required"),
   fuel: z.string().min(1, "Fuel information is required"),
   deposit: z.string().min(1, "Deposit amount is required"),
   make_year: z.string().min(1, "Make year is required"),
   image: z.instanceof(File, { message: "Image is required" })
      .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .refine(
         (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
         "Only .jpg, .jpeg, .png and .webp formats are supported"
      )
      .optional()
});

export default function EditBikePage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      type: "",
      seat: "",
      oil: "",
      city: "",
      area: "",
      day_price: "",
      seven_day_price: "",
      fifteen_day_price: "",
      month_price: "",
      limit: "",
      extra: "",
      fuel: "",
      deposit: "",
      make_year: "",
      image: "" as string | File | null,
   });
   const [errors, setErrors] = useState<{ [key: string]: string }>({});

   useEffect(() => {
      const fetchBike = async () => {
         try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Mock API delay
            // Replace with actual API call
            setFormData({
               name: "Sample Bike",
               type: "mountain",
               seat: "2",
               oil: "Synthetic",
               city: "New York",
               area: "Manhattan",
               day_price: "50",
               seven_day_price: "300",
               fifteen_day_price: "600",
               month_price: "1000",
               limit: "100",
               extra: "10",
               fuel: "Petrol",
               deposit: "500",
               make_year: "2022",
               image: "/api/placeholder/150/150"
            });
         } catch (error) {
            console.error("Error fetching bike:", error);
            toast.error("Failed to fetch bike details");
         } finally {
            setLoading(false);
         }
      };

      fetchBike();
   }, [resolvedParams.id]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === "file"
         ? (e.target as HTMLInputElement).files?.[0] || null
         : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
         bikeSchema.parse({
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
         // Replace with actual API call
         await new Promise(resolve => setTimeout(resolve, 1000));
         toast.success("Bike updated successfully");
         router.push("/admin/bikes");
         router.refresh();
      } catch (error) {
         console.error("Error updating bike:", error);
         toast.error("Failed to update bike");
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) return <Spinner />;

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

         <Card className="bg-secondary">
            <CardHeader>
               <CardTitle>Edit Bike</CardTitle>
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
                              className={errors.name ? "border-red-500" : ""}
                           />
                           {errors.name && (
                              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor="type">Type</Label>
                           <Select
                              name="type"
                              value={formData.type}
                              onValueChange={(value) => setFormData({ ...formData, type: value })}
                           >
                              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                 <SelectValue placeholder="Select bike type" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="mountain">Automatic</SelectItem>
                                 <SelectItem value="road">Manual</SelectItem>
                              </SelectContent>
                           </Select>
                           {errors.type && (
                              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor="make_year">Make Year</Label>
                           <Input
                              id="make_year"
                              name="make_year"
                              type="number"
                              value={formData.make_year}
                              onChange={handleChange}
                              className={errors.make_year ? "border-red-500" : ""}
                           />
                           {errors.make_year && (
                              <p className="text-red-500 text-sm mt-1">{errors.make_year}</p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor="image">Image</Label>
                           <Input
                              id="image"
                              name="image"
                              type="file"
                              onChange={handleChange}
                              className={`cursor-pointer ${errors.image ? "border-red-500" : ""}`}
                           />
                           {formData.image && typeof formData.image === 'string' && (
                              <img
                                 src={formData.image}
                                 alt={formData.name}
                                 className="mt-2 w-32 h-32 object-cover rounded-md"
                              />
                           )}
                           {errors.image && (
                              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                           )}
                        </div>
                     </div>

                     {/* Location Information */}
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Location</h3>
                        <div>
                           <Label htmlFor="city">City</Label>
                           <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className={errors.city ? "border-red-500" : ""}
                           />
                           {errors.city && (
                              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor="area">Area</Label>
                           <Input
                              id="area"
                              name="area"
                              value={formData.area}
                              onChange={handleChange}
                              className={errors.area ? "border-red-500" : ""}
                           />
                           {errors.area && (
                              <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                           )}
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
                                 className={errors.day_price ? "border-red-500" : ""}
                              />
                              {errors.day_price && (
                                 <p className="text-red-500 text-sm mt-1">{errors.day_price}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="seven_day_price">Weekly Price</Label>
                              <Input
                                 id="seven_day_price"
                                 name="seven_day_price"
                                 type="number"
                                 value={formData.seven_day_price}
                                 onChange={handleChange}
                                 className={errors.seven_day_price ? "border-red-500" : ""}
                              />
                              {errors.seven_day_price && (
                                 <p className="text-red-500 text-sm mt-1">{errors.seven_day_price}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="fifteen_day_price">15 Day Price</Label>
                              <Input
                                 id="fifteen_day_price"
                                 name="fifteen_day_price"
                                 type="number"
                                 value={formData.fifteen_day_price}
                                 onChange={handleChange}
                                 className={errors.fifteen_day_price ? "border-red-500" : ""}
                              />
                              {errors.fifteen_day_price && (
                                 <p className="text-red-500 text-sm mt-1">{errors.fifteen_day_price}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="month_price">Monthly Price</Label>
                              <Input
                                 id="month_price"
                                 name="month_price"
                                 type="number"
                                 value={formData.month_price}
                                 onChange={handleChange}
                                 className={errors.month_price ? "border-red-500" : ""}
                              />
                              {errors.month_price && (
                                 <p className="text-red-500 text-sm mt-1">{errors.month_price}</p>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Additional Information */}
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Additional Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Label htmlFor="seat">Seats</Label>
                              <Input
                                 id="seat"
                                 name="seat"
                                 type="number"
                                 value={formData.seat}
                                 onChange={handleChange}
                                 className={errors.seat ? "border-red-500" : ""}
                              />
                              {errors.seat && (
                                 <p className="text-red-500 text-sm mt-1">{errors.seat}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="oil">Oil</Label>
                              <Input
                                 id="oil"
                                 name="oil"
                                 value={formData.oil}
                                 onChange={handleChange}
                                 className={errors.oil ? "border-red-500" : ""}
                              />
                              {errors.oil && (
                                 <p className="text-red-500 text-sm mt-1">{errors.oil}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="fuel">Fuel</Label>
                              <Input
                                 id="fuel"
                                 name="fuel"
                                 value={formData.fuel}
                                 onChange={handleChange}
                                 className={errors.fuel ? "border-red-500" : ""}
                              />
                              {errors.fuel && (
                                 <p className="text-red-500 text-sm mt-1">{errors.fuel}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="deposit">Deposit</Label>
                              <Input
                                 id="deposit"
                                 name="deposit"
                                 type="number"
                                 value={formData.deposit}
                                 onChange={handleChange}
                                 className={errors.deposit ? "border-red-500" : ""}
                              />
                              {errors.deposit && (
                                 <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
                              )}
                           </div>

                           <div>
                              <Label htmlFor="limit">Limit</Label>
                              <Input
                                 id="limit"
                                 name="limit"
                                 type="number"
                                 value={formData.limit}
                                 onChange={handleChange}
                                 className={errors.limit ? "border-red-500" : ""}
                              />
                              {errors.limit && (
                                 <p className="text-red-500 text-sm mt-1">{errors.limit}</p>
                              )}
                           </div>
                           <div>
                              <Label htmlFor="extra">Extra</Label>
                              <Input
                                 id="extra"
                                 name="extra"
                                 type="number"
                                 value={formData.extra}
                                 onChange={handleChange}
                                 className={errors.extra ? "border-red-500" : ""}
                              />
                              {errors.extra && (
                                 <p className="text-red-500 text-sm mt-1">{errors.extra}</p>
                              )}
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
                        <Button type="submit" disabled={submitting}>
                           {submitting ? "Updating..." : "Update Bike"}
                        </Button>
                     </div>
                  </div>
               </form>
            </CardContent>
         </Card>

      </div>
   );
}
