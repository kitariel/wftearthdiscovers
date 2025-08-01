"use client";

import { useState } from "react";
import Image from "next/image";
import { api, type RouterOutputs } from "@/trpc/react";
import { BookmarkButton } from "./bookmark-button";

type WtfProduct = RouterOutputs["wtfProduct"]["getRandom"];

export function WtfProductCard() {
  const [currentProduct, setCurrentProduct] = useState<WtfProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const randomProductQuery = api.wtfProduct.getRandom.useQuery(undefined, {
    enabled: false,
  });

  const handleShowAnother = async () => {
    setIsLoading(true);
    try {
      const result = await randomProductQuery.refetch();
      if (result.data) {
        setCurrentProduct(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch random product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial product
  const { data: initialProduct } = api.wtfProduct.getRandom.useQuery();

  const displayProduct = currentProduct ?? initialProduct;

  if (!displayProduct) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-8 text-black shadow-sm">
        <div className="mb-4 text-6xl">🤷‍♂️</div>
        <h2 className="mb-2 text-2xl font-bold">No WTF Products Yet!</h2>
        <p className="text-center text-gray-600">
          Looks like we haven&apos;t found any weird stuff from Earth yet...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gray-50 border-b border-black/5 p-4 text-center">
        <h1 className="text-xl font-bold text-black">
          WTF Earth Finds
        </h1>
      </div>

      {/* Product Image */}
      <div className="relative h-80 bg-gray-50">
        <Image
          src={displayProduct.imageUrl}
          alt={displayProduct.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />

        {/* Featured Badge */}
        {displayProduct.isFeatured && (
          <div className="absolute top-4 right-4 rounded-full bg-black px-3 py-1 text-sm font-semibold text-white shadow-sm">
            Daily WTF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 text-black">
        <h2 className="mb-3 text-2xl font-bold text-black">
          {displayProduct.title}
        </h2>

        <p className="mb-4 text-lg leading-relaxed text-gray-700">
          {displayProduct.description}
        </p>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {displayProduct.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <a
              href={displayProduct.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-black px-6 py-4 text-center font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
            >
              Buy This WTF Thing
            </a>
            
            <BookmarkButton 
              product={displayProduct} 
              size="lg" 
              variant="outline"
              className="shrink-0"
            />
          </div>
          
          <button
            onClick={handleShowAnother}
            disabled={isLoading}
            className="w-full rounded-lg border border-black/20 bg-white px-6 py-4 font-semibold text-black transition-colors duration-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                Loading...
              </span>
            ) : (
              "Show Another WTF"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
