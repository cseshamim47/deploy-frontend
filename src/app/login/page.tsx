"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
}

interface UserDetails {
   firstName: string;
   lastName: string;
   email: string;
   phoneNumber: string;
}

const initialUserDetails: UserDetails = {
   firstName: "",
   lastName: "",
   email: "",
   phoneNumber: ""
};

const phoneSchema = z
   .string()
   .regex(/^01[0-9]{9}$/, "Please enter a valid Bangladeshi mobile number");

const detailsSchema = z.object({
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   email: z.string().email("Invalid email address"),
   phoneNumber: z.string()
});

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
   const [phoneNumber, setPhoneNumber] = useState<string>("");
   const [step, setStep] = useState<number>(1);
   const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
   const [otp, setOtp] = useState<string>("");
   const [isResending, setIsResending] = useState<boolean>(false);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

   const fetcher = (url: string, data: any) =>
     fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     }).then(res => res.json());

   // Reset all states when modal is closed
   useEffect(() => {
      if (!isOpen) {
         setTimeout(() => {
            setPhoneNumber("");
            setUserDetails(initialUserDetails);
            setOtp("");
            setStep(1);
            setIsResending(false);
            setIsSubmitting(false);
         }, 200); // Small delay to avoid visual glitches
      }
   }, [isOpen]);

   const handleModalClose = () => {
      onClose();
   };

   const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 11);
      setPhoneNumber(value);
   };

   const handlePhoneSubmit = async (): Promise<void> => {
      try {
         phoneSchema.parse(phoneNumber);
         setUserDetails(prev => ({ ...initialUserDetails, phoneNumber: phoneNumber }));
         await sendOTP();
      } catch (e) {
         if (e instanceof z.ZodError) {
            toast.error(e.errors[0].message);
         }
      }
   };

   const sendOTP = async (): Promise<void> => {
      try {
         setIsSubmitting(true);
         const response = await fetcher('/auth/send-otp', { phone: phoneNumber });
         toast.success("OTP sent to WhatsApp!");
         setOtp("");
         setStep(2);
      } catch (error) {
         toast.error("Failed to send OTP");
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDetailsSubmit = async (): Promise<void> => {
      try {
         detailsSchema.parse(userDetails);

         const updateData = {
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: userDetails.email
         };

         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/phone/${userDetails.phoneNumber}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
         });

         const data = await response.json();

         if (data) {
            toast.success("Details updated successfully!");
            handleModalClose();
            window.location.href = '/profile';
         } else {
            toast.error("Please try again later");
         }
      } catch (e) {
         if (e instanceof z.ZodError) {
            e.errors.forEach((err) => {
               if (err.path[0]) {
                  toast.error(err.message);
               }
            });
         } else {
            toast.error("Please try again later");
         }
      }
   };

   const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
      setOtp(value);
   };

   const resendOTP = async (): Promise<void> => {
      setIsResending(true);
      try {
         await fetcher('/auth/send-otp', { phone: phoneNumber });
         setOtp("");
         toast.success("OTP resent successfully!");
      } catch (error) {
         toast.error("Failed to resend OTP");
      } finally {
         setIsResending(false);
      }
   };
   const { login } = useAuth();

   const verifyOTP = async (): Promise<void> => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phoneNumber, otp }),
         });

         const data = await response.json();
         if (!data?.token || !data?.user) {
            toast.error("OTP verification failed");
            return;
         }

         const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            token: data.token,
         };

         document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
         login(userData);
         if (data.user.email?.includes('@temp.com')) {
            toast.success("OTP verified successfully!");
            setStep(3);
         } else {
            toast.success("Login successful!");
            // console.log(data);
            handleModalClose();
            window.location.href = '/profile';
         }
      } catch (error) {
         toast.error("OTP is not correct");
      }
   };

   // Handle back navigation
   const handleBack = () => {
      if (step > 1) {
         setStep(step - 1);
         // Clear relevant state based on current step
         if (step === 2) {
            setOtp("");
         }
      }
  };

  return (
     <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent>
           {step > 1 && (
              <Button
                 variant="ghost"
                 className="absolute left-4 top-4"
                 onClick={handleBack}
              >
                 Back
              </Button>
           )}

           {step === 1 && (
              <>
                 <DialogHeader>
                    <DialogTitle>Login with Phone Number</DialogTitle>
                    <DialogDescription>
                       Enter your Bangladeshi mobile number to continue
                    </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                       <label htmlFor="phone" className="text-sm font-medium">
                          Mobile Number
                       </label>
                       <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                             +91
                          </span>
                          <Input
                             id="phone"
                             type="tel"
                             placeholder="Enter 11 digit number"
                             value={phoneNumber}
                             onChange={handlePhoneNumberChange}
                             className="rounded-l-none"
                          />
                       </div>
                    </div>
                    <Button
                       className="w-full bg-green-600 hover:bg-green-700"
                       onClick={handlePhoneSubmit}
                       disabled={phoneNumber.length !== 11 || isSubmitting}
                    >
                       {isSubmitting ? "Sending OTP..." : "Continue"}
                    </Button>
                 </div>
              </>
           )}

           {step === 2 && (
              <>
                 <DialogHeader>
                    <DialogTitle>Verify OTP</DialogTitle>
                    <DialogDescription>
                       Enter the OTP sent to WhatsApp ({phoneNumber})
                    </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                       <label htmlFor="otp" className="text-sm font-medium">
                          Enter OTP
                       </label>
                       <Input
                          id="otp"
                          type="text"
                          maxLength={4}
                          value={otp}
                          onChange={handleOtpInput}
                          className="text-center text-2xl tracking-[1em] h-16"
                          placeholder="••••"
                       />
                    </div>

                    <div className="flex justify-between items-center">
                       <Button
                          variant="ghost"
                          onClick={resendOTP}
                          disabled={isResending}
                       >
                          {isResending ? "Resending..." : "Resend OTP"}
                       </Button>
                       <Button onClick={verifyOTP} disabled={otp.length !== 4}>
                          Verify OTP
                       </Button>
                    </div>
                 </div>
              </>
           )}

           {step === 3 && (
              <>
                 <DialogHeader>
                    <DialogTitle>Personal Details</DialogTitle>
                    <DialogDescription>
                       Please fill in your details
                    </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 mt-4">
                    <div className="flex gap-4">
                       <div className="flex-1 space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium">
                             First Name
                          </label>
                          <Input
                             id="firstName"
                             value={userDetails.firstName}
                             onChange={(e) =>
                                setUserDetails({ ...userDetails, firstName: e.target.value })
                             }
                          />
                       </div>
                       <div className="flex-1 space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium">
                             Last Name
                          </label>
                          <Input
                             id="lastName"
                             value={userDetails.lastName}
                             onChange={(e) =>
                                setUserDetails({ ...userDetails, lastName: e.target.value })
                             }
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label htmlFor="email" className="text-sm font-medium">
                          Email
                       </label>
                       <Input
                          id="email"
                          type="email"
                          value={userDetails.email}
                          onChange={(e) =>
                             setUserDetails({ ...userDetails, email: e.target.value })
                          }
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium">
                          Phone Number
                       </label>
                       <Input
                          value={`(+88)(${phoneNumber})`}
                          disabled
                          className=""
                       />
                    </div>

                    <Button
                       className="w-full"
                       onClick={handleDetailsSubmit}
                       disabled={isSubmitting}
                    >
                       {isSubmitting ? "Saving..." : "Complete Registration"}
                    </Button>
                 </div>
              </>
           )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
