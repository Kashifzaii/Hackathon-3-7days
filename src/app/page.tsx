import React from "react";
import Link from "next/link";
import Image from "next/image";
import Brand from "../Components/Brand";
import Ceramics from "../Components/Ceramics";
import Products from "../Components/Products";
import Join from "../Components/Join";
import Last from "../Components/Last";

const Page = () => {
  // Check if user is Admin (Replace with actual auth logic)
  const isAdmin = true; // Yeh aap apni authentication se replace karein

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative sm:-mt-28 md:-mt-20">
        <div className="flex flex-col md:flex-row items-center justify-start px-6 md:px-8 space-x-0">
          {/* Left Text Section */}
          <div className="bg-gray-900 w-full md:w-[750px] h-auto md:h-[584px] flex flex-col justify-between p-6">
            <h1 className="text-white font-clash-display mt-8 ml-14 font-semi-bold text-[24px] sm:text-[28px] md:text-[32px] leading-[32px] sm:leading-[38px] md:leading-[44.8px] text-left">
              The furniture brand for the <br /> future, with timeless designs
            </h1>

            <div className="flex justify-center md:justify-start mt-6">
              <Link href="/products">
                <button className="bg-black text-white font-satoshi w-[170px] h-14 mb-8 ml-12">
                  View Collection
                </button>
              </Link>
            </div>

            <p className="text-white font-satoshi font-light text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[24px] md:leading-[27px] mt-6">
              A new era in eco-friendly furniture with Avelon, the French luxury
              retail brand <br />
              with nice fonts, tasteful colors, and a beautiful way to display
              things digitally <br />
              using modern web technologies.
            </p>
          </div>

          {/* Right Image Section */}
          <div className="w-full md:w-[520px] h-auto flex justify-center md:justify-start mt-6 md:mt-0">
            <Image
              src="/home.png"
              alt="Luxury Furniture"
              width={1000}
              height={1000}
              className="w-full h-auto object-cover md:max-w-[520px] sm:w-full md:h-[584px] sm:h-[400px] lg:h-[584px]"
              priority
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <Brand />
      <Ceramics />
      <Products />
      <Join />
      <Last />

      {/* Admin Panel Access */}
      {isAdmin && (
        <div className="fixed bottom-5 right-5">
          <Link href="/admin">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition">
              Admin Panel
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;





















