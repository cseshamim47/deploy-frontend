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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

async function addCoupon(url: string, { arg }: { arg: FormData }) {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!response.ok) {
    throw new Error("Failed to add coupon");
  }

  return response.json();
}

export default function AddCouponPage() {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/offer`,
    addCoupon
  );

   const [errors, setErrors] = useState({
      title: "",
      description: "",
      amount: "",
      above_amount: "",
      image: "",
      coupon: "",
      status: "",
      start_date: "",
      end_date: "",
   });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    above_amount: "",
    image: null as File | null,
    coupon: "",
    status: "",
    start_date: "",
    end_date: "",
  });

   const validateForm = () => {
      const newErrors = {
         title: "",
         description: "",
         amount: "",
         above_amount: "",
         image: "",
         coupon: "",
         status: "",
         start_date: "",
         end_date: "",
      };

      let isValid = true;

      // Basic field validation
      if (!formData.title.trim()) {
         newErrors.title = "Title is required";
         isValid = false;
      }

      if (!formData.description.trim()) {
         newErrors.description = "Description is required";
         isValid = false;
      }

      if (!formData.coupon.trim()) {
         newErrors.coupon = "Coupon code is required";
         isValid = false;
      }

      if (!formData.status) {
         newErrors.status = "Status is required";
         isValid = false;
      }

      if (!formData.image) {
         newErrors.image = "Image is required";
         isValid = false;
      }

      // Numeric validation
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 0) {
         newErrors.amount = "Amount must be 0 or greater";
         isValid = false;
      }

      const aboveAmount = parseFloat(formData.above_amount);
      if (isNaN(aboveAmount) || aboveAmount < 0) {
         newErrors.above_amount = "Minimum purchase must be 0 or greater";
         isValid = false;
      }

      // Date validation
      if (!formData.start_date) {
         newErrors.start_date = "Start date is required";
         isValid = false;
      }

      if (!formData.end_date) {
         newErrors.end_date = "End date is required";
         isValid = false;
      }

      if (formData.start_date && formData.end_date) {
         const startDate = new Date(formData.start_date);
         const endDate = new Date(formData.end_date);
         const today = new Date();
         today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

         if (endDate < startDate) {
            newErrors.end_date = "End date must be after start date";
            isValid = false;
         }

         if (startDate < today) {
            newErrors.start_date = "Start date cannot be in the past";
            isValid = false;
         }
      }


      setErrors(newErrors);
      return isValid;
   };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
     const { name, value, type } = e.target;

     if (type === "file") {
        const fileInput = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: fileInput.files?.[0] || null });
     } else if (type === "number") {
        // Only allow non-negative numbers
        const numValue = value === "" ? "" : Math.max(0, Number(value));
        setFormData({ ...formData, [name]: numValue.toString() });
     } else {
        setFormData({ ...formData, [name]: value });
     }

     // Clear error when field is modified
     setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
     }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      await trigger(formDataToSend);
      toast.success("Coupon added successfully");
      router.push("/admin/coupons");
    } catch (error) {
      console.error("Failed to add coupon:", error);
      toast.error("Failed to add coupon. Please check all fields and try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Coupons
        </Button>
      </div>

        <Card className="bg-secondary">
           <CardHeader>
              <CardTitle className="text-2xl">Add New Coupon</CardTitle>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                       <h3 className="text-lg font-semibold">Basic Information</h3>
                       <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                             id="title"
                             name="title"
                             value={formData.title}
                             onChange={handleChange}
                             className={errors.title ? "border-red-500" : ""}
                          />
                          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                       </div>
                       <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                             id="description"
                             name="description"
                             value={formData.description}
                             onChange={handleChange}
                             className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                          />
                          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                       </div>
                       <div>
                          <Label htmlFor="image">Coupon Image</Label>
                          <Input
                             id="image"
                             name="image"
                             type="file"
                             onChange={handleChange}
                             className={`cursor-pointer ${errors.image ? "border-red-500" : ""}`}
                          />
                          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                       </div>
                    </div>

              {/* Coupon Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coupon Details</h3>
                <div>
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <Input
                    id="coupon"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleChange}
                             className={`uppercase ${errors.coupon ? "border-red-500" : ""}`}
                  />
                          {errors.coupon && <p className="text-red-500 text-sm mt-1">{errors.coupon}</p>}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                             onValueChange={(value) => {
                                setFormData({ ...formData, status: value });
                                setErrors({ ...errors, status: "" });
                             }}
                  >
                             <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select coupon status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
              </div>

              {/* Discount Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Discount Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Discount Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                                min="0"
                      value={formData.amount}
                      onChange={handleChange}
                                className={errors.amount ? "border-red-500" : ""}
                    />
                             {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                  </div>
                  <div>
                    <Label htmlFor="above_amount">Minimum Purchase</Label>
                    <Input
                      id="above_amount"
                      name="above_amount"
                      type="number"
                                min="0"
                      value={formData.above_amount}
                      onChange={handleChange}
                                className={errors.above_amount ? "border-red-500" : ""}
                    />
                             {errors.above_amount && <p className="text-red-500 text-sm mt-1">{errors.above_amount}</p>}
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Validity Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                             <div className="relative">
                                <div
                                   className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                >
                                   <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <Input
                                   id="start_date"
                                   name="start_date"
                                   type="date"
                                   value={formData.start_date}
                                   onChange={handleChange}
                                   className={`cursor-pointer ${errors.start_date ? "border-red-500" : ""}`}
                                   onClick={(e) => {
                                      const input = e.target as HTMLInputElement;
                                      input.showPicker();
                                   }}
                                />
                             </div>
                             {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                             <div className="relative">
                                <div
                                   className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                >
                                   <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <Input
                                   id="end_date"
                                   name="end_date"
                                   type="date"
                                   value={formData.end_date}
                                   onChange={handleChange}
                                   className={`cursor-pointer ${errors.end_date ? "border-red-500" : ""}`}
                                   onClick={(e) => {
                                      const input = e.target as HTMLInputElement;
                                      input.showPicker();
                                   }}
                                />
                             </div>
                             {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                  </div>
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
                {isMutating ? "Adding..." : "Add Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
