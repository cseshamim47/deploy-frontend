"use client";
import React from "react";
import Navigation from "../Navigation/Navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Search from "./Search/Search";

const Hero = () => {
  return (
    <div className="grid md:grid-cols-2">
      <div className="order-2">
        <div className="mt-10 md:mt-0 md:hidden">
          <Search />
        </div>
      </div>
      
      <div className="relative h-[500px] w-full order-1 md:order-2 overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5 z-10 transition-colors duration-300 hover:bg-green-500/20" />
        <Image
          src="/images/hero/bike-3.jpg"
          alt="Logo"
          fill
          className="object-cover object-[35%_center]"
          priority
        />
      </div>
    </div>
  );
};

export default Hero;
