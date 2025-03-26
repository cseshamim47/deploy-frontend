"use client";
import React, { useState } from "react";
import {
   NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
   NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LoginModal from "@/app/login/page";
import { useAuth } from "@/context/AuthContext";

const navigationItems = ["Home", "Services", "Offers"];

const Navigation = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
   const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getHref = (item: string) => {
    return item === "Home" ? "/" : `/${item.toLowerCase()}`;
  };

   const handleLoginClick = () => {
      if (user) {
         window.location.href = "/profile";
      } else {
         setIsLoginOpen(true);
      }
  };

  return (
    <>
        <div className="h-20"></div>
      <div className="bg-secondary p-4 shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-10">
              {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={120}
                height={40}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-200 hover:text-primary"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-16">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={getHref(item)}
                        className={`${
                          pathname === getHref(item)
                            ? "text-primary"
                            : "text-gray-200"
                        } hover:text-primary font-medium`}
                      >
                        {item}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                       {/* Show Admin Dashboard if Admin */}
                       {user?.role === "admin" && (
                          <NavigationMenuItem>
                             <NavigationMenuLink asChild>
                                <Link
                                   href="/admin"
                                   className="text-gray-200 hover:text-primary font-medium"
                                >
                                   Admin Dashboard
                                </Link>
                             </NavigationMenuLink>
                          </NavigationMenuItem>
                       )}

                       {/* Login/Logout Button */}
                <NavigationMenuItem>
                          {user ? (
                             <div className="flex gap-4">

                                <Link
                                   href={'/profile'}
                                   className="text-gray-200 hover:text-primary font-medium"
                                >
                                   Profile
                                </Link>
                             <button
                                onClick={logout}
                                className="text-gray-200 hover:text-primary font-medium"
                             >
                                Logout
                             </button>

                             </div>
                          ) : (
                                <button
                                   onClick={handleLoginClick}
                                   className="text-gray-200 hover:text-primary font-medium"
                                >
                                   Login
                                </button>
                          )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-secondary transform transition-transform duration-300 ease-in-out z-50 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            {/* Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-gray-200 font-bold text-xl">Menu</span>
              <button
                className="text-gray-200 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

                 {/* Mobile Menu Items */}
            <div className="pt-6 px-6">
              <nav className="flex flex-col space-y-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item}
                    href={getHref(item)}
                    className={`${
                      pathname === getHref(item)
                        ? "text-primary"
                        : "text-gray-200"
                    } hover:text-primary font-medium`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}

                       {/* Show Admin Dashboard if Admin */}
                       {user?.role === "admin" && (
                          <Link
                             href="/admin"
                             className="text-gray-200 hover:text-primary font-medium"
                             onClick={() => setIsMenuOpen(false)}
                          >
                             Admin Dashboard
                          </Link>
                       )}

                       {/* Login/Logout Button */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                             user ? logout() : handleLoginClick();
                  }}
                  className="text-gray-200 hover:text-primary font-medium text-left"
                >
                          {user ? "Logout" : "Login"}
                </button>
              </nav>
            </div>
          </div>

          {/* Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navigation;
