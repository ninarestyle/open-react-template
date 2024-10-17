"use client";

import { useState, useEffect } from "react";

export enum ListingApparelConditionEnum {
    BrandNew = 0,
    Unused = 1,
    Excellent = 2,
    VeryGood = 3,
    Good = 4,
    Fair = 5,
    Used = 6,
}

export default function HeroHome() {
  // State variables for storing input values
  const [brand, setBrand] = useState<string>("");
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [condition, setCondition] = useState<number | "">("");
  const [size, setSize] = useState<string>("");

  // State for storing the API response
  const [apiResponse, setApiResponse] = useState<{
    price?: string;
    audience?: string;
    trend?: string;
    occasion?: string;
    brandInfo?: string;
  } | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Load JWT token and form data from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        setJwtToken(token);
        setIsAuthenticated(true);
      }

      const savedFormData = localStorage.getItem("pendingFormData");
      if (savedFormData) {
        const { brand, condition, size } = JSON.parse(savedFormData);
        setBrand(brand);
        setCondition(condition);
        setSize(size);
        localStorage.removeItem("pendingFormData"); // Clear the saved data after loading
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  // Function to handle Google Login redirect
  const handleGoogleLogin = () => {
    // Save the current form data to localStorage
    const formData = {
      brand,
      condition,
      size,
    };
    localStorage.setItem("pendingFormData", JSON.stringify(formData));

    // Redirect to Google login endpoint
    window.location.href = "/api/auth/google";
  };

  // Handle picture upload
  const handlePictureUpload = async (files: FileList | null) => {
    if (!files) return [];

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/media/upload-media-files`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Use the actual JWT token
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload pictures");
      }

      const data = await response.json();
      const urls = data.data?.payload?.urls;
      return urls; // Assuming the response contains an array of URLs
    } catch (error) {
      console.error("Error uploading pictures:", error);
      return [];
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    if (!brand || !pictures || !condition || !size) {
      alert("All fields are required. Please fill in the brand, upload pictures, select condition, and enter size.");
      return;
    }

    const requestData = {
      brand,
      condition,
      size,
      images: pictures,
    };

    if (!isAuthenticated) {
      alert("Please log in first.");
      handleGoogleLogin(); // Redirect to Google login
      return;
    }

    console.log("logged in already");

    setIsLoading(true); // Set loading state to true

    // Upload pictures and get URLs
    const uploadedPictures = await handlePictureUpload(pictures);

    if (!uploadedPictures || uploadedPictures.length === 0) {
      console.error("No pictures were uploaded successfully.");
      setIsLoading(false); // Set loading state to false
      return;
    }

    // Update requestData with uploaded pictures
    requestData.images = uploadedPictures;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/ai-assistant/estimate-resale-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`, // Use the actual JWT token
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setApiResponse(data); // Update the state with the API response
    } catch (error) {
      console.error("Error fetching resale price:", error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <section className="bg-gray-100 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="text-4xl font-semibold text-gray-900 md:text-5xl"
              data-aos="fade-up"
            >
              Resale Price Lookup
            </h1>

            <div className="mx-auto max-w-3xl bg-white p-8 rounded-md shadow-md">
              {/* Resale Price Lookup Form */}
              <form
                className="mt-8 space-y-6"
                data-aos="fade-up"
                data-aos-delay={200}
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-lg font-bold text-gray-800"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={brand}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBrand(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="pictures"
                    className="block text-lg font-bold text-gray-800"
                  >
                    Upload Pictures
                  </label>
                  <input
                    type="file"
                    id="pictures"
                    name="pictures"
                    className="mt-1 block w-full text-gray-900 font-semibold"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPictures(e.target.files)
                    }
                    multiple
                  />
                </div>

                <div>
                  <label
                    htmlFor="condition"
                    className="block text-lg font-bold text-gray-800"
                  >
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={condition}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setCondition(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  >
                    <option value="">Select Condition</option>
                    <option value={ListingApparelConditionEnum.BrandNew}>Brand New</option>
                    <option value={ListingApparelConditionEnum.Unused}>Unused</option>
                    <option value={ListingApparelConditionEnum.Excellent}>Excellent</option>
                    <option value={ListingApparelConditionEnum.VeryGood}>Very Good</option>
                    <option value={ListingApparelConditionEnum.Good}>Good</option>
                    <option value={ListingApparelConditionEnum.Fair}>Fair</option>
                    <option value={ListingApparelConditionEnum.Used}>Used</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="size"
                    className="block text-lg font-bold text-gray-800"
                  >
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={size}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSize(e.target.value)
                    }
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Lookup Price"}
                  </button>
                </div>
              </form>

              {/* Display the API Response */}
              {apiResponse && (
                <div className="mt-10 p-6 bg-gray-50 rounded-md shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Resale Price Details:
                  </h2>
                  <p className="mt-4 text-lg text-gray-800">
                    <strong>Price:</strong> {apiResponse.price}
                  </p>
                  <p className="mt-2 text-lg text-gray-800">
                    <strong>Audience:</strong> {apiResponse.audience}
                  </p>
                  <p className="mt-2 text-lg text-gray-800">
                    <strong>Trend:</strong> {apiResponse.trend}
                  </p>
                  <p className="mt-2 text-lg text-gray-800">
                    <strong>Occasion:</strong> {apiResponse.occasion}
                  </p>
                  <p className="mt-2 text-lg text-gray-800">
                    <strong>Brand Information:</strong> {apiResponse.brandInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
