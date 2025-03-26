"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { useState } from "react";
import Spinner from "@/components/Spinner/Spinner";

// Mock data - replace with actual API call
const mockServices = [
   {
      id: 1,
      title: "Web Development",
      description: "Full stack web development services including frontend and backend development",
      image: "/api/placeholder/150/150"
   },
   {
      id: 2,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile application development",
      image: "/api/placeholder/150/150"
   },
   {
      id: 3,
      title: "Cloud Solutions",
      description: "Cloud infrastructure setup and maintenance",
      image: "/api/placeholder/150/150"
   },
];

export default function ServicesPage() {
   const [isLoading] = useState(false);
   const [error] = useState<Error | null>(null);
   const services = mockServices;

   if (error) return <div className="mt-20">Failed to load services</div>;
   if (isLoading) return <Spinner />;

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Services</h1>
            <Link href="/admin/services/add">
               <Button>Add New Service</Button>
            </Link>
         </div>
         <DataTable columns={columns} data={services} />
      </div>
   );
}
