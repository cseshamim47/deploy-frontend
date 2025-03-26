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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Coupon } from "../../columns";
import Spinner from "@/components/Spinner/Spinner";
import { use } from "react";

export default function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    title: "",
    description: "",
    coupon: "",
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/offer/${resolvedParams.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch coupon");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching coupon:", error);
        toast.error("Failed to fetch coupon details");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer/${resolvedParams.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update coupon");

      toast.success("Coupon updated successfully");
      router.push("/admin/coupons");
      router.refresh();
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Coupon</CardTitle>
          <CardDescription>Update the coupon details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code</Label>
              <Input
                id="coupon"
                value={formData.coupon}
                onChange={(e) =>
                  setFormData({ ...formData, coupon: e.target.value })
                }
                required
              />
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
                {submitting ? "Updating..." : "Update Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
