"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Coupon } from "./columns";
import Spinner from "@/components/Spinner/Spinner";

export default function CouponsPage() {
  const {
    data: coupons,
    error,
    isLoading,
  } = useSWR<Coupon[]>(`${process.env.NEXT_PUBLIC_API_URL}/offer`, fetcher);

  if (error) return <div className="mt-20">Failed to load coupons</div>;
  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/add">
          <Button>Add New Coupon</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={coupons || []} />
    </div>
  );
}
