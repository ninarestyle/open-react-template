"use client";

import { useState } from "react";

export default function HeroHome() {
  // State variables for storing input values
  const [brand, setBrand] = useState<string>("");
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [condition, setCondition] = useState<string>("");
  const [size, setSize] = useState<string>("");

  // State for storing the API response
  const [apiResponse, setApiResponse] = useState<{
    price?: string;
    audience?: string;
    trend?: string;
    occasion?: string;
    brandInfo?: string;
  } | null>(null);

  // Handle picture upload
  const handlePictureUpload = async () => {
    if (!pictures) return [];

    const formData = new FormData();
    for (let i = 0; i < pictures.length; i++) {
      formData.append("files", pictures[i]);
    }

    try {
      const response = await fetch(
        "https://restyle-prod-001.wl.r.appspot.com/media/upload-media-files",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im1pbmltYWw1ZDM1ZTkwYyIsImVtYWlsIjoienNkOWdoY3lzNUBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJzdWIiOiIwODNmY2QzOC1kOTBkLTQ1YjAtYjQzMC0yNGU5YjI5OTNiZjEiLCJpYXQiOjE3MTM4MDQ2MzIsImV4cCI6MTcyOTM1NjYzMn0.iwoOIzG0wqphOAS9RDRHrFEJ4cHedmUZrIOp2NSfpxs`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload pictures");
      }

      const data = await response.json();
      const urls = data.data?.payload?.urls
      return urls; // Assuming the response contains an array of URLs
    } catch (error) {
      console.error("Error uploading pictures:", error);
      return [];
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Upload pictures and get URLs
    const uploadedPictures = await handlePictureUpload();

    if (!uploadedPictures || uploadedPictures.length === 0) {
      console.error("No pictures were uploaded successfully.");
      return;
    }

    // Create JSON data to send to the API
    const requestData = {
      brand,
      condition,
      size,
      images: uploadedPictures.urls,
    };

    try {
      const response = await fetch(
        "https://restyle-prod-001.wl.r.appspot.com/ai-assistant/estimate-resale-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im1pbmltYWw1ZDM1ZTkwYyIsImVtYWlsIjoienNkOWdoY3lzNUBwcml2YXRlcmVsYXkuYXBwbGVpZC5jb20iLCJzdWIiOiIwODNmY2QzOC1kOTBkLTQ1YjAtYjQzMC0yNGU5YjI5OTNiZjEiLCJpYXQiOjE3MTM4MDQ2MzIsImV4cCI6MTcyOTM1NjYzMn0.iwoOIzG0wqphOAS9RDRHrFEJ4cHedmUZrIOp2NSfpxs`, // Replace jwtToken with your actual JWT
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
              <form
                className="mt-8 space-y-6"
                data-aos="fade-up"
                data-aos-delay={200}
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="brand" className="block text-lg font-bold text-gray-800">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={brand}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="pictures" className="block text-lg font-bold text-gray-800">
                    Upload Pictures
                  </label>
                  <input
                    type="file"
                    id="pictures"
                    name="pictures"
                    className="mt-1 block w-full text-gray-900 font-semibold"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPictures(e.target.files)}
                    multiple
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="block text-lg font-bold text-gray-800">
                    Condition
                  </label>
                  <input
                    type="text"
                    id="condition"
                    name="condition"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={condition}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCondition(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-lg font-bold text-gray-800">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 font-semibold focus:border-indigo-500 focus:ring-indigo-500"
                    value={size}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSize(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn w-full bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Lookup Price
                  </button>
                </div>
              </form>

              {/* Display the API Response */}
              {apiResponse && (
                <div className="mt-10 p-6 bg-gray-50 rounded-md shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900">Resale Price Details:</h2>
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