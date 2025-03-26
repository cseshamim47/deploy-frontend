"use client"

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';
export interface Order {
   id: number;
   customerName: string;
   bikeName: string;
   startDate: string;
   endDate: string;
   status: string;
   amount: number;
}

const mockOrders: Order[] = [
   {
      id: 1,
      customerName: "John Doe",
      bikeName: "Honda CBR",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      status: "active",
      amount: 2500,
   },
   {
      id: 2,
      customerName: "Jane Smith",
      bikeName: "Royal Enfield Classic",
      startDate: "2024-02-12",
      endDate: "2024-02-14",
      status: "pending",
      amount: 1800,
   },
   {
      id: 3,
      customerName: "Mike Johnson",
      bikeName: "Yamaha R15",
      startDate: "2024-02-08",
      endDate: "2024-02-11",
      status: "completed",
      amount: 1500,
   },
];

export function OrdersTable() {
   const columnHelper = createColumnHelper<Order>();

   const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
         case 'active':
            return 'bg-green-100 text-green-800';
         case 'pending':
            return 'bg-yellow-100 text-yellow-800';
         case 'completed':
            return 'bg-blue-100 text-blue-800';
         default:
            return 'bg-gray-100 text-gray-800';
      }
   };

   const handleEndTrip = (orderId: number) => {
      console.log('End trip for order:', orderId);
   };

   const handleExtendTrip = (orderId: number) => {
      console.log('Extend trip for order:', orderId);
   };

   const handleStartTrip = (orderId: number) => {
      console.log('Start trip for order:', orderId);
   };

   const columns = [
      columnHelper.accessor('id', {
         header: 'Order ID',
         cell: (info) => `#${info.getValue()}`,
      }),
      columnHelper.accessor('customerName', {
         header: 'Customer',
      }),
      columnHelper.accessor('bikeName', {
         header: 'Bike',
      }),
      columnHelper.accessor('startDate', {
         header: 'Start Date',
      }),
      columnHelper.accessor('endDate', {
         header: 'End Date',
      }),
      columnHelper.accessor('status', {
         header: 'Status',
         cell: (info) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(info.getValue())}`}>
               {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
            </span>
         ),
      }),
      columnHelper.accessor('amount', {
         header: 'Amount',
         cell: (info) => `₹${info.getValue()}`,
      }),
      columnHelper.accessor('actions', {
         header: 'Actions',
         cell: (info) => {
            const status = info.row.original.status;
            return (
               <div className="flex gap-2">
                  {status === 'active' && (
                     <>
                        <Button
                           variant="outline"
                           size="sm"
                           className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                           onClick={() => handleEndTrip(info.row.original.id)}
                        >
                           End Trip
                        </Button>
                        <Button
                           variant="outline"
                           size="sm"
                           className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                           onClick={() => handleExtendTrip(info.row.original.id)}
                        >
                           Extend
                        </Button>
                     </>
                  )}
                  {status === 'pending' && (
                     <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={() => handleStartTrip(info.row.original.id)}
                     >
                        Start Trip
                     </Button>
                  )}
               </div>
            );
         },
      }),
   ];


   const table = useReactTable({
      data: mockOrders,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div className="space-y-8">
         {/* Order Stats */}
         <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            <StatsCard
               title="Active Orders"
               value={mockOrders.filter(o => o.status === 'active').length}
               icon={<Clock className="h-4 w-4 text-muted-foreground" />}
               trend="+2"
               className="border-l-4 border-green-500"
            />
            <StatsCard
               title="Pending Orders"
               value={mockOrders.filter(o => o.status === 'pending').length}
               icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
               trend="+1"
               className="border-l-4 border-yellow-500"
            />
            <StatsCard
               title="Completed Orders"
               value={mockOrders.filter(o => o.status === 'completed').length}
               icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
               trend="+5"
               className="border-l-4 border-blue-500"
            />
         </div>

         {/* Orders Table */}
         <Card>
            <CardHeader>
               <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                           <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                 <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                 </TableHead>
                              ))}
                           </TableRow>
                        ))}
                     </TableHeader>
                     <TableBody>
                        {table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
