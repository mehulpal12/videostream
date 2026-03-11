"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
}

export default function CheckoutButton({ courseId, price }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleEnrollment = async () => {
    console.log("SENDING REQUEST TO ID:", courseId); // Check this in your browser console!
  if (!courseId || courseId === "undefined") {
    alert("System Error: Course ID is missing.");
    return;
  }
    setIsLoading(true);
    try {
      // 1. Trigger the Enrollment API
      // In a live app, you would integrate Razorpay here before calling this
      const response = await axios.post(`/api/courses/${courseId}/enroll`);

      if (response.status === 201 || response.status === 200) {
        setIsSuccess(true);
        
        // 2. Refresh the server cache and redirect to the player
        setTimeout(() => {
          router.refresh();
          router.push(`/courses/${courseId}/watch`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Enrollment failed:", error);
      alert(error.response?.data?.error || "Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnrollment}
      disabled={isLoading || isSuccess}
      className={`w-full py-8 text-xl font-black rounded-2xl transition-all shadow-xl group ${
        isSuccess 
          ? "bg-green-600 hover:bg-green-600 shadow-green-600/20" 
          : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
      }`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : isSuccess ? (
        <span className="flex items-center gap-2">
          <CheckCircle2 size={24} /> Enrollment Successful!
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Proceed to Pay ₹{price.toLocaleString()}
          <CreditCard className="ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
      )}
    </Button>
  );
}