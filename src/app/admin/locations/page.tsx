"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import Spinner from "@/components/Spinner/Spinner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LocationsPage() {
   const { data: cities, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/city`, fetcher);

   if (error) return <div className="mt-20">Failed to load locations</div>;
   if (isLoading) return <Spinner />;

   // Transform cities data to match table structure
   const locationsData = cities.map((city: any) => ({
      id: city.id,
      name: city.name,
      areas: city.areas || []
   }));

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Locations</h1>
            <div className="space-x-3">
               <Link href="/admin/locations/city/add">
                  <Button>Add New City</Button>
               </Link>
               <Link href="/admin/locations/areas/add">
                  <Button>Add New Area</Button>
               </Link>
            </div>
         </div>
         <DataTable columns={columns} data={locationsData} />
      </div>
   );
}
