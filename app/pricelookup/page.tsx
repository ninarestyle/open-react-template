"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ListingApparelConditionEnum } from "./enum";

export default function HeroHome() {
    const router = useRouter();
    const [brand, setBrand] = useState<string>("");
    const [pictures, setPictures] = useState<FileList | null>(null);
    const [condition, setCondition] = useState<number | "">("");
    const [size, setSize] = useState<string>("");

    const [apiResponse, setApiResponse] = useState<{
        price?: string;
        description?: string;
        suggestedMarketplaces?: string;
        brandInfo?: string;
    } | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [lastSubmittedData, setLastSubmittedData] = useState<string>("");

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
                localStorage.removeItem("pendingFormData");
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
    }, []);

    const handleGoogleLogin = () => {
        const formData = { brand, condition, size };
        localStorage.setItem("pendingFormData", JSON.stringify(formData));
        window.location.href = "/api/auth/google";
    };

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
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload pictures");

            const data = await response.json();
            const urls = data.data?.payload?.urls;
            return urls;
        } catch (error) {
            console.error("Error uploading pictures:", error);
            return [];
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert("Please log in first.");
            handleGoogleLogin();
            return;
        }

        const currentFormData = JSON.stringify({ brand, condition, size, pictures });

        if (currentFormData === lastSubmittedData) {
            alert("You've already submitted this data. Please change the input to submit again.");
            return;
        }

        setIsLoading(true);

        const uploadedPictures = await handlePictureUpload(pictures);

        if (!uploadedPictures || uploadedPictures.length === 0) {
            console.error("No pictures were uploaded successfully.");
            setIsLoading(false);
            return;
        }

        const requestData = { brand, condition, size, images: uploadedPictures };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/ai-assistant/estimate-resale-price`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            setApiResponse(data);

            // Update the last submitted data to prevent duplicate submissions
            setLastSubmittedData(currentFormData);
        } catch (error) {
            console.error("Error fetching resale price:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formIsValid = brand && pictures && condition && size;

    return (
        <section className="bg-gray-200 py-12 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
                <div className="py-12 md:py-20">
                    <div className="pb-12 md:pb-20">
                        <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl">
                            Resale Price Lookup
                        </h1>
                        <div className="mx-auto max-w-3xl bg-white p-8 rounded-md shadow-md">
                            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                {/* Brand Input */}
                                <div>
                                    <label htmlFor="brand" className="block text-lg font-bold text-gray-800">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-gray-600 text-gray-900"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </div>

                                {/* Picture Upload */}
                                <div>
                                    <label htmlFor="pictures" className="block text-lg font-bold text-gray-800">
                                        Upload Pictures
                                    </label>
                                    <input
                                        type="file"
                                        id="pictures"
                                        multiple
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-gray-600 text-gray-900"
                                        onChange={(e) => setPictures(e.target.files)}
                                    />
                                </div>

                                {/* Condition Dropdown */}
                                <div>
                                    <label htmlFor="condition" className="block text-lg font-bold text-gray-800">
                                        Condition
                                    </label>
                                    <select
                                        id="condition"
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-700 text-gray-900"
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value === "" ? "" : Number(e.target.value))}
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

                                {/* Size Input */}
                                <div>
                                    <label htmlFor="size" className="block text-lg font-bold text-gray-800">
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        id="size"
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-gray-600 text-gray-900"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className={`btn w-full text-white ${formIsValid && !isLoading ? 'bg-indigo-800 hover:bg-indigo-900' : 'bg-gray-500 cursor-not-allowed'}`}
                                        disabled={!formIsValid || isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Lookup Price"}
                                    </button>
                                </div>
                            </form>

                            {/* Display API Response */}
                            {apiResponse && (
                                <div className="mt-10 p-6 bg-gray-100 rounded-md shadow-sm">
                                    <h2 className="text-2xl font-semibold text-gray-900">Resale Price Details:</h2>
                                    <p className="mt-4 text-lg text-gray-800"><strong>Price:</strong> {apiResponse.price}</p>
                                    <p className="mt-2 text-lg text-gray-800"><strong>Description:</strong> {apiResponse.description}</p>
                                    <p className="mt-2 text-lg text-gray-800"><strong>Marketplace:</strong> {apiResponse.suggestedMarketplaces}</p>
                                    <p className="mt-2 text-lg text-gray-800"><strong>Brand Info:</strong> {apiResponse.brandInfo}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
