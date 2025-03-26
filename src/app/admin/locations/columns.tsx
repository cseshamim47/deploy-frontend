"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react";
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export type Area = { id: number; name: string };
export type Location = { id: number; name: string; areas: Area[]; image?: string };

export const columns: ColumnDef<Location>[] = [
   {
      accessorKey: "name",
      header: ({ column }) => (
         <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
            City Name <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
      ),
   },
   {
      id: "areas",
      header: "Areas",
      cell: ({ row }) => {
         const location = row.original;
         const [isDialogOpen, setIsDialogOpen] = useState(false);
         const [deletingAreaId, setDeletingAreaId] = useState<number | null>(null);

         const handleDeleteArea = async (areaId: number, areaName: string) => {
            try {
               setDeletingAreaId(areaId);
               toast.loading(`Deleting area ${areaName}...`);

               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/area/${areaId}`, {
                  method: 'DELETE'
               });

               if (!response.ok) {
                  throw new Error('Failed to delete area');
               }

               await mutate(`${process.env.NEXT_PUBLIC_API_URL}/city`);
               toast.dismiss();
               toast.success(`Deleted area ${areaName}`);
            } catch (error) {
               console.error("Error deleting area:", error);
               toast.dismiss();
               toast.error("Failed to delete area");
            } finally {
               setDeletingAreaId(null);
            }
         };

         return (
            <>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
               >
                  <Eye className="h-4 w-4 mr-1" /> View Areas
               </Button>

               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Areas in {location.name}</DialogTitle>
                     </DialogHeader>
                     <div className="space-y-2">
                        {location.areas.length > 0 ? (
                           location.areas.map((area) => (
                              <div key={area.id} className="p-2 border rounded-md flex justify-between">
                                 {area.name}
                                 <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteArea(area.id, area.name)}
                                    disabled={deletingAreaId === area.id}
                                 >
                                    {deletingAreaId === area.id ? "Deleting..." : "Delete"}
                                 </Button>
                              </div>
                           ))
                        ) : (
                           <p className="text-muted-foreground">No areas available.</p>
                        )}
                     </div>
                  </DialogContent>
               </Dialog>
            </>
         );
      },
   },
   {
      id: "actions",
      cell: ({ row }) => {
         const location = row.original;
         const router = useRouter();
         const [isDropdownOpen, setIsDropdownOpen] = useState(false);
         const [isDeleting, setIsDeleting] = useState(false);

         const handleDelete = async () => {
            try {
               setIsDeleting(true);
               toast.loading("Deleting city and associated areas...");

               // First delete all associated areas
               const deleteAreaPromises = location.areas.map(area => 
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/area/${area.id}`, {
                     method: 'DELETE'
                  })
               );
               
               await Promise.all(deleteAreaPromises);

               // Then delete the city
               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/${location.id}`, {
                  method: 'DELETE'
               });

               if (!response.ok) {
                  throw new Error('Failed to delete city');
               }

               await mutate(`${process.env.NEXT_PUBLIC_API_URL}/city`);
               toast.dismiss();
               toast.success("City and associated areas deleted successfully");
               router.refresh();
            } catch (error) {
               console.error("Error deleting city:", error);
               toast.dismiss();
               toast.error("Failed to delete city and its areas");
            } finally {
               setIsDeleting(false);
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
                  <DropdownMenuItem onClick={() => router.push(`/admin/locations/city/edit/${location.id}`)}>
                     Edit City
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                           className="text-red-600 focus:text-red-600"
                           onSelect={(e) => e.preventDefault()}
                        >
                           {isDeleting ? "Deleting..." : "Delete City"}
                        </DropdownMenuItem>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This will permanently delete the city and all associated areas.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
                           >
                              {isDeleting ? "Deleting..." : "Delete"}
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
