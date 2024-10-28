"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

export default function HeroHome() {
  const router = useRouter(); // Initialize useRouter

  // State for authentication and loading
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Load JWT token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        setJwtToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  // Function to handle Google Login redirect
  const handleGoogleLogin = () => {
    alert("Please log in first.");
    window.location.href = "/api/auth/google";
  };

  // Function to handle resale price lookup
  const handleLookupPrice = () => {
    if (!isAuthenticated) {
      handleGoogleLogin();
      return;
    }
    // Logic to initiate the resale price lookup can be added here
    alert("Resale Price Lookup initiated!"); // Placeholder action
  };

  return (
    <section className="bg-gray-100 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <div className="py-12 md:py-20">
          <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl" data-aos="fade-up">
            Resale Suggestions & Guide
          </h1>

          {/* Button container */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Marketplace Button */}
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors"
            >
              Marketplace Insights
            </button>

            {/* Lookup Price Button */}
            <button
              onClick={() => router.push("/pricelookup")}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors"
            >
              Lookup Resale Price
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
