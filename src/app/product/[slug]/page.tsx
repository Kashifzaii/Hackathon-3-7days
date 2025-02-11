"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import SingleProduct from "@/Components/SingleProduct";
import RelatedProducts from "@/Components/RelatedProducts";

interface Product {
  image: string;
  _id: string;
  name: string;
  price: number;
  salesPrice?: number;
  description: string;
  tags: string[];
  sizes?: string[];
  slug: {
    current: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string; // Ensure slug is a string

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return; // Ensure slug is present before fetching

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the selected product
        const productQuery = `*[_type == "product" && slug.current == $slug][0]{
          _id, image, name, price, salesPrice, description, tags, sizes, slug
        }`;
        const productData: Product | null = await client.fetch(productQuery, { slug });

        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch related products based on matching tags (excluding the current product)
        const relatedProductsQuery = `*[_type == "product" && _id != $id && tags match $tags][0...5]{
          _id, image, name, price, salesPrice, description, tags, sizes, slug
        }`;
        const relatedProductsData: Product[] = await client.fetch(relatedProductsQuery, {
          id: productData._id,
          tags: productData.tags?.join(" ") || "",
        });

        setRelatedProducts(relatedProductsData);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to fetch product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl m-auto xl:px-0 px-5 mt-24">
        <p className="text-gray-500 text-center">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl m-auto xl:px-0 px-5 mt-24">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl m-auto xl:px-0 px-5 mt-24">
      {product ? <SingleProduct product={product} /> : null}
      
      {relatedProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-5">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <RelatedProducts key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
