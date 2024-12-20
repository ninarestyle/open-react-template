"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceEnum, PreferredCategoryEnum } from "./enum";

export default function ResaleGuide() {
    const router = useRouter();
    const [marketplace, setMarketplace] = useState<string>("");
    const [preferredCategory, setPreferredCategory] = useState<string>("");

    const [apiResponse, setApiResponse] = useState<{
        popularBrands?: string[];
        priceRangeInsight?: string;
        buyerDemographics?: {
            dominantAgeGroups: string;
            genderDistribution: string[];
        };
        popularStyleInsights?: string;
        sourcingStrategies?: string;
        returnPolicyInsights?: string;
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
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
    }, []);

    const handleGoogleLogin = () => {
        alert("Please log in first.");
        window.location.href = "/api/auth/google";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!marketplace || !preferredCategory) {
            alert("Please select both a marketplace and a preferred category.");
            return;
        }

        if (!isAuthenticated) {
            handleGoogleLogin();
            return;
        }

        const requestData = JSON.stringify({ marketplace, preferredCategory });

        // Prevent submission if data is the same as last submitted
        if (requestData === lastSubmittedData) {
            alert("You've already submitted this information. Please make changes before submitting again.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/ai-assistant/resale-beginner-guide`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    body: requestData,
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const responseJson = await response.json();
            const data = responseJson?.data?.payload;
            console.log("response", data);
            setApiResponse(data);

            // Update last submitted data to prevent duplicate submissions
            setLastSubmittedData(requestData);
        } catch (error) {
            console.error("Error fetching resale guide:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formIsValid = marketplace && preferredCategory;

    return (
        <section className="bg-gray-200 py-12 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                {/* Back to Home Button */}
                <div className="mb-6 text-left">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="py-12 md:py-20">
                    <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl text-center">
                        Resale Guide Lookup
                    </h1>

                    <div className="mx-auto max-w-3xl bg-white p-8 rounded-md shadow-md mt-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="marketplace"
                                    className="block text-lg font-bold text-gray-800 text-left"
                                >
                                    Where you consider to list
                                </label>
                                <select
                                    id="marketplace"
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-700 focus:ring-indigo-700 text-gray-900 font-semibold"
                                    style={{ color: marketplace ? "#4a4a4a" : "#9ca3af" }}
                                    value={marketplace}
                                    onChange={(e) => setMarketplace(e.target.value)}
                                >
                                    <option value="" disabled>Select Marketplace</option>
                                    <option value={MarketplaceEnum.eBay}>eBay</option>
                                    <option value={MarketplaceEnum.Poshmark}>Poshmark</option>
                                    <option value={MarketplaceEnum.Depop}>Depop</option>
                                    <option value={MarketplaceEnum.FacebookMarketplace}>Facebook Marketplace</option>
                                    <option value={MarketplaceEnum.Mercari}>Mercari</option>
                                    <option value={MarketplaceEnum.Grailed}>Grailed</option>
                                    <option value={MarketplaceEnum.ThredUp}>ThredUp</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="preferredCategory"
                                    className="block text-lg font-bold text-gray-800 text-left"
                                >
                                    Which category you consider to sell
                                </label>
                                <select
                                    id="preferredCategory"
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-700 focus:ring-indigo-700 text-gray-900 font-semibold"
                                    style={{ color: preferredCategory ? "#4a4a4a" : "#9ca3af" }}
                                    value={preferredCategory}
                                    onChange={(e) => setPreferredCategory(e.target.value)}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value={PreferredCategoryEnum.Shoes}>Shoes</option>
                                    <option value={PreferredCategoryEnum.Bags}>Bags</option>
                                    <option value={PreferredCategoryEnum.Clothing}>Clothing</option>
                                    <option value={PreferredCategoryEnum.Accessories}>Accessories</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`btn w-full text-white ${formIsValid && !isLoading ? 'bg-indigo-800 hover:bg-indigo-900' : 'bg-gray-500 cursor-not-allowed'}`}
                                disabled={!formIsValid || isLoading}
                            >
                                {isLoading ? "Loading..." : "Get Guide"}
                            </button>
                        </form>

                        {/* Display the API Response */}
                        {apiResponse && (
                            <div className="mt-10 p-6 bg-gray-100 rounded-md shadow-sm text-left">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Resale Guide Details:
                                </h2>
                                <p className="mt-4 text-lg text-gray-800">
                                    <strong>Popular Brands:</strong> {apiResponse.popularBrands?.join(", ")}
                                </p>
                                <p className="mt-2 text-lg text-gray-800">
                                    <strong>Price Range Insight:</strong> {apiResponse.priceRangeInsight}
                                </p>
                                <p className="mt-2 text-lg text-gray-800">
                                    <strong>Buyer Demographics:</strong>
                                    {apiResponse?.buyerDemographics ? (
                                        <>
                                            <br />
                                            <span>Age Range: {apiResponse.buyerDemographics.dominantAgeGroups}</span>
                                            <br />
                                            <span>
                                                Gender Distribution:{" "}
                                                {apiResponse.buyerDemographics.genderDistribution
                                                    ? Object.entries(apiResponse.buyerDemographics.genderDistribution)
                                                        .map(([gender, percentage]) => `${gender}: ${percentage}`)
                                                        .join(", ")
                                                    : "N/A"}
                                            </span>
                                        </>
                                    ) : (
                                        " N/A"
                                    )}
                                </p>
                                <p className="mt-2 text-lg text-gray-800">
                                    <strong>Popular Style Insights:</strong> {apiResponse.popularStyleInsights}
                                </p>
                                <p className="mt-2 text-lg text-gray-800">
                                    <strong>Sourcing Strategies:</strong> {apiResponse.sourcingStrategies}
                                </p>
                                <p className="mt-2 text-lg text-gray-800">
                                    <strong>Return Policy Insights:</strong> {apiResponse.returnPolicyInsights}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
