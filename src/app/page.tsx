"use client"
import Faq from "@/components/Hompage/Faq";
import Hero from "@/components/Hompage/Hero";
import HowToBook from "@/components/Hompage/HowToBook";
import Search from "@/components/Hompage/Search/Search";
import WhyChooseUs from "@/components/Hompage/WhyChooseUs";

export default function Home() {
  return (
    <div className="container mx-auto md:px-10 space-between-sections mt-16 relative">
      <Hero />
      <WhyChooseUs />
      <HowToBook />
      <Faq />
      {/* <Test /> */}
        <div className="fixed top-7 w-1/3 hidden md:block">
           <Search variant="vertical" />
      </div>
    </div>
  );
}
