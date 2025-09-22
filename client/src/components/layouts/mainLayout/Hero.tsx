"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/product/${encodeURIComponent(query.trim())}`);
  };
  return (
    <section className="bg-beige text-olive  flex items-center justify-center px-6 ">
      <div className="max-w-7xl mx-auto text-center w-full ">
        {/* Hero Text */}
        <div className="mb-4 mt-4">
          <h1 className="  text-xl md:text-6xl lg:text-8xl xl:text-[7rem] font-black mb-12 leading-[0.85] tracking-tight">
            Discover Amazing
            <br />
            <span className="text-olive/80">Products</span>
          </h1>
          <p className="text-base md:text-3xl lg:text-4xl text-olive/70  mx-auto leading-relaxed mb-4 font-medium">
            Explore our wide range of items crafted with care and quality for
            your everyday needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center px-4 mb-4">
          <div className="flex items-center gap-4 bg-white rounded-full border border-olive/30 shadow-md hover:shadow-lg hover:border-olive/50 transition-all duration-300 w-full max-w-3xl px-6 py-4">
            <FaSearch className="text-olive/60 text-xl " />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="flex-1 bg-transparent text-olive placeholder:text-olive/50 outline-none text-base sm:text-lg font-medium"
            />
            <button
              onClick={handleSearch}
              className="bg-olive text-beige px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-olive/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
// text-xl md:text-6xl lg:text-8xl xl:text-[10rem]
