"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { mutate } from "swr";

export type Service = {
   id: number;
   title: string;
   description: string;
   image: string;
};

export const columns: ColumnDef<Service>[] = [
   {
      accessorKey: "title",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               Title
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         );
      },
   },
   {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
         const description = row.original.description;
         return (
            <div className="max-w-xs truncate" title={description}>
               {description}
            </div>
         );
      },
   },
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         return (
            <img
               src={row.original.image}
               alt={row.original.title}
               className="w-16 h-16 object-cover rounded-md"
            />
         );
      },
   },
   {
      id: "actions",
      cell: ({ row }) => {
         const service = row.original;
         const router = useRouter();
         const [isDropdownOpen, setIsDropdownOpen] = useState(false);

         const handleDelete = async () => {
            try {
               await new Promise(resolve => setTimeout(resolve, 500));
               toast.success("Service deleted successfully");
               mutate("/api/services");
               router.refresh();
            } catch (error) {
               console.error("Error deleting service:", error);
               toast.error("Failed to delete service");
            }
         };

         return (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                     <span className="sr-only">Open menu</span>
                     <MoreHorizontal className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push(`/admin/services/edit/${service.id}`)}>
                     Edit service
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                           className="text-red-600 focus:text-red-600"
                           onSelect={(e) => e.preventDefault()}
                        >
                           Delete service
                        </DropdownMenuItem>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              the service and remove it from our servers.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                           >
                              Delete
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </DropdownMenuContent>
            </DropdownMenu>
         );
      },
   },
];
