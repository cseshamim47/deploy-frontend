"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Bike } from "./columns";
import Spinner from "@/components/Spinner/Spinner";

export default function BikesPage() {
  const {
    data: bikes,
    error,
    isLoading,
  } = useSWR<Bike[]>(`${process.env.NEXT_PUBLIC_API_URL}/bike`, fetcher);

  if (error) return <div className="mt-20">Failed to load bikes</div>;
  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bikes</h1>
        <Link href="/admin/bikes/add">
          <Button>Add New Bike</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={bikes || []} />
    </div>
  );
}
