import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CancellationModal = ({ open, onOpenChange }) => {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between">
               <DialogTitle className="text-xl font-semibold text-center flex-grow">
                  Cancellation Policy
               </DialogTitle>
               {/* <button onClick={() => onOpenChange(false)} className="text-gray-500">
                  <X className="h-5 w-5" />
               </button> */}
            </DialogHeader>

            <div className="mt-4">
               <table className="w-full border-collapse">
                  <thead>
                     <tr>
                        <th className="bg-[#95D03A] text-white p-3 border">Time of Cancellation</th>
                        <th className="bg-[#95D03A] text-white p-3 border">Refund Percentage</th>
                        <th className="bg-[#95D03A] text-white p-3 border">Refund Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="p-3 border">In case of Partial Payment</td>
                        <td className="p-3 border">100% Deduction</td>
                        <td className="p-3 border">₹ 0</td>
                     </tr>
                     <tr className="bg-accent">
                        <td colSpan={3} className="p-3 border font-medium">In case of Full Payment</td>
                     </tr>
                     <tr>
                        <td className="p-3 border">If cancelled before 72 hours from pickup time</td>
                        <td className="p-3 border">25% Deduction</td>
                        <td className="p-3 border">₹ 130.88</td>
                     </tr>
                     <tr>
                        <td className="p-3 border">If cancelled between 72 and 24 hours before pickup time</td>
                        <td className="p-3 border">75% Deduction</td>
                        <td className="p-3 border">₹ 43.63</td>
                     </tr>
                     <tr>
                        <td className="p-3 border">If cancelled within 24 hours of pickup time</td>
                        <td className="p-3 border">100% Deduction</td>
                        <td className="p-3 border">₹ 0</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export const CancellationButton = () => {
   const [open, setOpen] = React.useState(false);

   return (
      <>
         <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 border rounded-md hover:bg-muted"
         >
            <span className="text-sm font-medium">Cancellation Policy</span>
            <ChevronRight className="h-4 w-4" />
         </button>

         <CancellationModal
            open={open}
            onOpenChange={setOpen}
         />
      </>
   );
};

export default CancellationButton;
