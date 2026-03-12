"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
}

export default function CheckoutButton({ courseId, price }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!courseId || courseId === "undefined") {
      alert("System Error: Course ID is missing.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create a Stripe Checkout Session via your API
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      // 2. Redirect the user to the Stripe-hosted checkout page
      window.location.assign(response.data.url);
      
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      alert(error.response?.data?.error || "Could not connect to payment gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStripeCheckout}
      disabled={isLoading}
      className="w-full py-8 text-xl font-black rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 group transition-all"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <span className="flex items-center gap-2">
          Proceed to Pay ₹{price.toLocaleString()}
          <CreditCard className="ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
      )}
    </Button>
  );
}