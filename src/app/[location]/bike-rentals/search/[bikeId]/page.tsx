import BikeDetail from "@/components/Bike/BikeDetail";

const mockBike = {
   name: "Royal Enfield Classic 350",
   image: "/images/bikes/bike-1.webp",
   lastServiced: "15 Jan 2024",
   makeYear: "2022",
   available: 1,
   packages: [
      {
         name: "Basic",
         price: 800,
         included: "Helmet, Basic Insurance",
      },
      {
         name: "Standard",
         price: 1000,
         included: "Helmet, Full Insurance, Roadside Assistance",
      },
      {
         name: "Premium",
         price: 1200,
         included: "Helmet, Full Insurance, Roadside Assistance, Extra Fuel",
      },
   ],
   features: {
      displacement: "110 cc",
      topSpeed: "85 kmph",
      fuelCapacity: "5.5 L",
      seats: "2 Seater",
      kerbWeight: "110 kg",
      mileage: "51 kmpl"
   },
   pickupLocation: {
      name: "INA Metro Station",
      timings: "7:00 AM to 10:00 PM",
      distanceLimit: "100 kms",
      excessCharge: "₹3 per km",
      latePenalty: "₹100 per hour",
      securityDeposit: "₹2000"
   }
};



export default function BikePage() {
   return <BikeDetail bike={mockBike} />;
}
