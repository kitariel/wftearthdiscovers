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
    <div className="mx-auto max-w-lg relative overflow-hidden rounded-2xl shadow-xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 text-center">
        <h1 className="text-xl font-bold text-white drop-shadow-lg">
          🌍 WTF Earth Discovers
        </h1>
      </div>

      {/* Full Card Image Background */}
      <div className="relative aspect-[3/4] bg-gray-50">
        <Image
          src={displayProduct.imageUrl}
          alt={displayProduct.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Featured Badge */}
        {displayProduct.isFeatured && (
          <div className="absolute top-20 right-4 rounded-full bg-black/80 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-white shadow-md">
            ⭐ Daily WTF
          </div>
        )}

        {/* Bookmark Button */}
        <div className="absolute top-20 left-4">
          <BookmarkButton 
            product={displayProduct} 
            size="lg" 
            variant="filled"
          />
        </div>

        {/* Floating Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white leading-tight drop-shadow-lg">
            {displayProduct.title}
          </h2>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {displayProduct.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white border border-white/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href={displayProduct.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-white/90 backdrop-blur-sm px-6 py-3 text-center font-semibold text-black transition-all duration-300 hover:bg-white hover:scale-105"
            >
              🛒 Buy This WTF Thing
            </a>
            
            <button
              onClick={handleShowAnother}
              disabled={isLoading}
              className="w-full rounded-lg border-2 border-white/30 bg-white/20 backdrop-blur-sm px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></div>
                  Loading...
                </span>
              ) : (
                "🎲 Show Another WTF"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
