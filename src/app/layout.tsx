import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Hompage/Footer";
import { Toaster } from "sonner";
import { BikeRentalProvider } from "@/context/BikeRentalContext";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Bike rent in India",
   description: "Best bike rental service",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${spaceGrotesk.className} antialiased dark flex flex-col min-h-screen`}
         >
            <AuthProvider>
               <Toaster position="top-center" />
               {/* Navigation is fixed and not part of the flex-grow section */}
               <Navigation />
               {/* Main Content Area */}

               <BikeRentalProvider>
             <SearchProvider>
               <main className="flex-grow container mx-auto px-6">{children}</main>
             </SearchProvider>
           </BikeRentalProvider>


               {/* Footer */}
               <Footer />
            </AuthProvider>
         </body>
      </html>
   );
}
