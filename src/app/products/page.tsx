"use client";

import { client } from "../../sanity/lib/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { urlFor } from "../../sanity/lib/image";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CardContext";
import Link from "next/link";
import { Toast } from "@/Components/Toast";
import { WishlistButton } from "@/Components/WishlistButton";

interface ProductsCard {
  _id: string;
  name: string;
  price: number;
  image: any;
  description: string;
  slug: {
    current: string;
  };
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductsCard[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;

  // Fetch paginated products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const query = `{
      "products": *[_type == "product"] | order(_createdAt desc) [$start...$end]{
        _id,
        name,
        price,
        image,
        description,
        slug
      },
      "totalProducts": count(*[_type == "product"])
    }`;

    try {
      const { products, totalProducts } = await client.fetch(query, {
        start: (currentPage - 1) * productsPerPage,
        end: currentPage * productsPerPage,
      });

      setTotalProducts(totalProducts);
      setProducts(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleAddToCart = (product: ProductsCard) => {
    dispatch({
      type: "ADD_TO_CART",
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        description: product.description,
      },
    });

    setToastMessage(`${product.name} added to cart!`);
    setToastType("success");
    setShowToast(true);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <section>
      <div className="px-8 py-12 text-[#2A254B] mt-6">
        <h2 className="text-darkPrimary font-extrabold text-[30px] font-clash-display mt-[80px] ml-[70px]">
          Our Popular Products
        </h2>

        {/* Show loading or error message */}
        {loading ? (
          <p className="text-center text-gray-500 mt-6">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-6">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mt-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col items-center p-4"
                >
                  <Link href={`/product/${product.slug.current}`}>
                    <Image
                      src={
                        product.image
                          ? urlFor(product.image).width(250).height(250).quality(80).url()
                          : "/placeholder.png"
                      }
                      height={250}
                      width={250}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                    />
                  </Link>

                  <div className="mt-4 text-[#2A254B] text-center">
                    <p className="py-2 text-[18px] font-satoshi font-bold">
                      {product.name}
                    </p>
                    <p className="text-lg text-darkPrimary">${product.price}</p>

                    <div className="flex items-center justify-center gap-4 mt-4">
                      <FaShoppingCart
                        onClick={() => handleAddToCart(product)}
                        className="text-[24px] hover:text-darkPrimary transition-colors cursor-pointer"
                      />

                      <WishlistButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-darkPrimary text-white rounded-l-lg hover:bg-opacity-80 disabled:bg-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 ${
                      currentPage === index + 1
                        ? "bg-darkPrimary text-white"
                        : "bg-white text-darkPrimary"
                    } hover:bg-darkPrimary hover:text-white transition-all`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-darkPrimary text-white rounded-r-lg hover:bg-opacity-80 disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </section>
  );
};

export default ProductsPage;
