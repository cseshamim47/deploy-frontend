"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
   ChevronRight,
   AlertCircle,
   CalendarDays,
   ShieldCheck,
   Clock,
   MapPin,
   CircleDollarSign,
   AlertOctagon,
   Calendar,
   Gauge,
   Timer,
   Fuel,
   Users,
   Weight,
   BarChart2
} from "lucide-react"
import CancellationButton from "./CancelationModal"
import { Input } from "../ui/input"
import useSWR from "swr"

interface BikeDetailProps {
   bike: {
      name: string;
      image: string;
      lastServiced: string;
      makeYear: string;
      available: number;
      packages: Array<{
         name: string;
         price: number;
         included: string;
      }>;
      features: {
         displacement: string;
         topSpeed: string;
         fuelCapacity: string;
         seats: string;
         kerbWeight: string;
         mileage: string;
      };
      pickupLocation: {
         name: string;
         timings: string;
         distanceLimit: string;
         excessCharge: string;
         latePenalty: string;
         securityDeposit: string;
      };
   };
}
const fetcher = (url: string) =>
   new Promise<{ coupons: Record<string, number> }>((resolve) =>
      setTimeout(() => resolve({ coupons: { "SAVE10": 10, "DISCOUNT20": 20 } }), 500)
   )
export default function BikeDetail({ bike }: BikeDetailProps) {

   const [couponCode, setCouponCode] = useState("")
   const [discount, setDiscount] = useState(0)
   const [error, setError] = useState("")
   const { data } = useSWR("/api/coupons", fetcher)

   const basePrice = 550
   const discountedPrice = basePrice - (basePrice * discount) / 100

   const applyCoupon = () => {
      if (!data) return
      const validDiscount = data.coupons[couponCode.toUpperCase()]
      if (validDiscount) {
         setDiscount(validDiscount)
         setError("")
      } else {
         setError("Invalid Coupon Code")
         setDiscount(0)
      }
   }


   return (
      <div className="container mx-auto px-4 py-6 ">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left Column - Bike Image & Details */}
            <div className="space-y-6">
               {bike.available === 1 && (
                  <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-md text-sm">
                     Only {bike.available} Bike Available
                  </div>
               )}

               <div className="relative w-full max-h-[500px] aspect-[4/3] md:aspect-square rounded-lg overflow-hidden">
                  <Image
                     src={bike.image}
                     alt={bike.name}
                     fill
                     className="object-contain "
                     priority
                  />
               </div>

               <p className="text-sm text-muted-foreground italic">
                  *Images are for representation purposes only.
               </p>

               <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-2">
                     <CalendarDays className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-sm font-medium">Last Serviced</p>
                        <p className="text-sm text-muted-foreground">{bike.lastServiced}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-sm font-medium">Make Year</p>
                        <p className="text-sm text-muted-foreground">{bike.makeYear}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="space-y-6 lg:max-w-xl lg:ml-auto lg:mt-6 w-full">
               <h1 className="text-2xl font-bold">{bike.name}</h1>

               {/* Price Details */}
               <Card>
                  <CardContent className="pt-6 space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Rent Amount</span>
                        <span className={discount > 0 ? "line-through text-gray-400" : ""}>
                           ₹ {basePrice.toFixed(2)}
                        </span>
                     </div>
                     {discount > 0 && (
                        <div className="flex justify-between text-sm font-bold">
                           <span>Discounted Price</span>
                           <span>₹ {discountedPrice.toFixed(2)}</span>
                        </div>
                     )}
                     <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>₹ {discountedPrice.toFixed(2)}</span>
                     </div>
                     <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-800">
                           Refundable Deposit - ₹ 3000 (To be paid at the time of pickup)
                        </p>
                     </div>
                  </CardContent>
               </Card>

               {/* Coupon Input */}
               <div className="flex items-center space-x-2">
                  <Input
                     placeholder="Enter Coupon Code"
                     value={couponCode}
                     onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} className="bg-green-500 hover:bg-green-600">
                     Apply
                  </Button>
               </div>
               {error && <p className="text-sm text-red-600">{error}</p>}
               {discount > 0 && (
                  <p className="text-sm text-green-600">
                     Coupon Applied! {discount}% off
                  </p>
               )}

               <Button className="w-full bg-green-500 hover:bg-green-600">
                  Book Now
               </Button>

               <CancellationButton />
            </div>
         </div>
         <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">Things To Remember</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                     <ShieldCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium">Security Deposit</h3>
                  <p className="text-green-600 font-medium">₹{bike.pickupLocation.securityDeposit}</p>
               </div>
               <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                     <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium">Location Timings</h3>
                  <p className="text-green-600">{bike.pickupLocation.timings}</p>
               </div>
               <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                     <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium">Distance Limit</h3>
                  <p className="text-green-600">{bike.pickupLocation.distanceLimit}</p>
               </div>
               <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                     <CircleDollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium">Excess Charge</h3>
                  <p className="text-green-600">{bike.pickupLocation.excessCharge}</p>
               </div>
               <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                     <AlertOctagon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium">Late Penalty</h3>
                  <p className="text-green-600">{bike.pickupLocation.latePenalty}</p>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
               <div className="flex items-center gap-2">
                  <Gauge className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Displacement</p>
                     <p className="font-medium">{bike.features.displacement}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Timer className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Top Speed</p>
                     <p className="font-medium">{bike.features.topSpeed}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Fuel className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Fuel Capacity</p>
                     <p className="font-medium">{bike.features.fuelCapacity}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Seats</p>
                     <p className="font-medium">{bike.features.seats}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Weight className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Kerb Weight</p>
                     <p className="font-medium">{bike.features.kerbWeight}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                  <div>
                     <p className="text-sm text-muted-foreground">Mileage</p>
                     <p className="font-medium">{bike.features.mileage}</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Pickup Location Section */}
         <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">Pickup Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">{bike.pickupLocation.name}</h3>
                  {/* Add any additional location details here */}
               </div>
               <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image
                     src="/maps/location-map.png"
                     alt="Pickup Location Map"
                     fill
                     className="object-cover"
                  />
                  <p className="absolute bottom-2 right-2 text-sm text-blue-600 bg-white px-2 py-1 rounded">
                     Exact location will be provided after the booking
                  </p>
               </div>
            </div>
         </section>
      </div>

   );
}
