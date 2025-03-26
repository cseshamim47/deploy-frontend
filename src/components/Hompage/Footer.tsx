"use client";

import React from "react";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa6";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";



const cities = [
  "Agra",
  "Ahmedabad",
  "Bangalore",
  "Chandigarh",
  "Chennai",
  "Bhubaneswar",
  "Shimla",
  "Gokarna",
  "Kochi",
  "Mangalore",
  "Bhopal",
  "Agartala",
  "Jodhpur",
  "Udupi",
  "Vadodara",
  "Amritsar",
  "Mount Abu",
  "Gwalior",
  "Dehradun",
  "Delhi",
  "Ghaziabad",
  "Goa",
  "Gurgaon",
  "Pondicherry",
  "Ooty",
  "Trivandrum",
  "Wayanad",
  "Puri",
  "Varanasi",
  "Vijayawada",
  "Kota",
  "Mathura",
  "Madurai",
  "Thrissur",
  "Nainital",
  "Dharamshala",
  "Guwahati",
  "Hyderabad",
  "Jaipur",
  "Kolkata",
  "Leh",
  "Indore",
  "Coorg",
  "Munnar",
  "Lucknow",
  "Varkala",
  "Mysore",
  "Tirupati",
  "Surat",
  "Raipur",
  "Ranchi",
  "Rameshwaram",
  "Cuttack",
  "Manali",
  "Mumbai",
  "Noida",
  "Pune",
  "Udaipur",
  "Vizag",
  "Faridabad",
  "Bir Billing",
  "Rishikesh",
  "Coimbatore",
  "Nagpur",
  "Siliguri",
  "Chikmagalur",
  "Hampi",
  "Srinagar",
  "Alibaug",
  "Mahabaleshwar",
  "Mussoorie",
];

const footerLinks = {
  div1: ["Contact Us", "Privacy Policy", "Terms and Conditions", "Blog"],
  div2: ["Offers", "List Your Vehicle", "FAQs"],
  div3: ["About Us", "support@gobikes.co.in", "+918448444897"],
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);
  

  return (
    <div className={`${pathname === "/" ? "md:space-y-14" : ""}  bg-secondary py-10 mt-20 z-10`}>
      <div className={`space-y-8 container mx-auto px-10 relative ${pathname === "/" ? "md:block" : ""} hidden`}>
        <h2 className="text-center font-bold text-xl">Bike Rentals in India</h2>
        <div className="grid grid-cols-4 gap-2">
          {cities.map((city, index) => (
            <div className="text-sm" key={index}>
              <Link href={`#`}> Bike on Rent in {city} </Link>
            </div>
          ))}
        </div>

        <motion.div
          className="absolute top-5 right-0 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          <FaArrowUp className="text-lg text-primary" />
        </motion.div>
      </div>
      <div className="border-b-2 pb-10">
        <div className="container mx-auto px-10 relative">
          <div className=" w-full grid md:grid-cols-4 grid-cols-1 gap-4">
            <div className="mb-4 flex justify-center md:justify-start md:items-start">
              <Image src="/images/logo.svg" alt="logo" width={150} height={0} />
            </div>
            {Object.entries(footerLinks).map(([key, values]) => (
              <div key={key} className="md:space-y-1">
                {values.map((link, index) => (
                  <p key={index}>
                    <Link href={`#`} className="hover:text-primary">{link}</Link>
                  </p>

                ))}
              </div>
            ))}
          </div>
          <motion.div
          className={`absolute ${pathname === "/" ? "top-5 right-10 cursor-pointer md:hidden" : "top-4 right-8 md:top-0 md:right-0 cursor-pointer"}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          <FaArrowUp className="text-lg text-primary" />
        </motion.div>
        </div>
      </div>

      <div className={`flex justify-between container mx-auto px-10 pt-10  ${pathname === "/" ? "md:pt-0" : ""}`} >
        <div>© Gobikes. All Rights Reserved</div>
        <div className="flex justify-between items-center gap-3 md:gap-6">
            <Link href="#"> <FaInstagram className="hover:cursor-pointer hover:text-primary" /> </Link>
            <Link href="#"> <FaTwitter className="hover:cursor-pointer hover:text-primary"/> </Link> 
            <Link href="#"> <FaFacebook className="hover:cursor-pointer hover:text-primary"/> </Link>

        </div>
      </div>
    </div>
  );
};

export default Footer;
