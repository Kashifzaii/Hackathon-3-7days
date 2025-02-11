import Image from "next/image";
import Link from "next/link";
import React from "react";
import Brand from "../../Components/Brand";
import Join from "../../Components/Join";
import Section from "../../Components/Section";
import Head from 'next/head'

const Page = () => {
  return (
    <>
      <Head>
        <title>About Us - Our Brand</title>
        <meta name="description" content="A brand built on the love of craftsmanship, quality, and outstanding customer service." />
      </Head>

      <div>
        <section className="sm:h-48 w-full flex max-sm:flex-col max-sm:gap-10 sm:pt-4 pt-10 sm:mt-0 mt-0 items-center justify-between md:px-24 px-5">
          <h1 className="sm:text-2xl text-xl font-clash text-darkPrimary sm:w-[500px] max-xxs:px-3">
            A brand built on the love of craftsmanship, quality, and outstanding customer service
          </h1>
          <Link href="/products">
            <button className="bg-gray-200 h-12 sm:w-36 w-full sm:text-sm text-xs font-medium rounded-md transition hover:bg-gray-300">
              View our products
            </button>
          </Link>
        </section>
        <ImageSection />
        <Section
          direction={false}
          heading="Our service isn't just personal, it's actually hyper personally exquisite"
          image="/aboutt.png"
        />
        <Brand />
        <Join />
      </div>
    </>
  );
};

export default Page;

// ✅ Moved ImageSection before usage
const ImageSection = () => {
  return (
    <div className="flex mmd:px-20 px-5 max-md:flex-col sm:gap-4 gap-5 py-10">
      <TextSection />
      <section className="relative md:h-[450px] h-[300px] md:w-1/2 w-full">
        <Image src="/imge.png" alt="About Us Image" fill className="object-cover rounded-lg" />
      </section>
    </div>
  );
};

// ✅ Moved TextSection before usage
const TextSection = () => {
  return (
    <section className="md:h-[450px] max-md:gap-10 md:w-1/2 w-full bg-gray-900 text-white sm:py-12 py-8 flex flex-col justify-between sm:px-10 px-5 rounded-lg">
      <div className="flex flex-col gap-8">
        <h1 className="xs:text-2xl text-2xl font-bold">It started with a small idea</h1>
        <p className="text-sm sm:text-base">
          A global brand with local beginnings, our story began in a small studio in South London in early 2014.
        </p>
      </div>
      <Link href="/products">
        <button className="bg-gray-200 text-black h-12 md:w-36 w-full capitalize text-sm font-medium rounded-md transition hover:bg-gray-300">
          View Collection
        </button>
      </Link>
    </section>
  );
};
