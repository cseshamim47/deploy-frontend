"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
   id: string;
   name: string;
   email: string;
   phone: string;
   role: "user" | "admin";
   token: string;
}

interface AuthContextType {
   user: User | null;
   login: (userData: User) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
      // Load from localStorage on mount
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
         setUser(JSON.parse(storedUser));
      }
   }, []);

   const login = (userData: User) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
   };

   const logout = () => {
      localStorage.removeItem("user");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setUser(null);
      window.location.href = "/";
   };

   return (
      <AuthContext.Provider value={{ user, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
