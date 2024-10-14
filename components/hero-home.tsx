import { useState } from "react";

export default function HeroHome() {
  // State variables for storing input values
  const [brand, setBrand] = useState<string>("");
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [condition, setCondition] = useState<string>("");
  const [size, setSize] = useState<string>("");

  // Handler functions for inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictures(e.target.files);
  };

  return (
    <section>
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
            <div className="mx-auto max-w-3xl">
              <form className="mt-8 space-y-6" data-aos="fade-up" data-aos-delay={200}>
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={brand}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="pictures" className="block text-sm font-medium text-gray-700">
                    Upload Pictures
                  </label>
                  <input
                    type="file"
                    id="pictures"
                    name="pictures"
                    className="mt-1 block w-full"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <input
                    type="text"
                    id="condition"
                    name="condition"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={condition}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCondition(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
