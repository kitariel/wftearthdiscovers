"use client";

import Image from "next/image";
import { api, type RouterOutputs } from "@/trpc/react";

type WtfProduct = RouterOutputs["wtfProduct"]["getDailyFeatured"];

export function DailyWtf() {
  const { data: featuredProduct, isLoading } = api.wtfProduct.getDailyFeatured.useQuery();

  if (isLoading) {
    return (
      <div className="bg-white border border-black/10 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!featuredProduct) {
    return (
      <div className="bg-white border border-black/10 rounded-2xl p-6 text-center shadow-sm">
        <div className="text-4xl mb-2">📅</div>
        <h3 className="text-lg font-bold mb-2 text-black">No Daily WTF Today</h3>
        <p className="text-gray-600 text-sm">Check back tomorrow for more weird finds!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50 text-black p-4 text-center border-b border-black/5">
        <h3 className="font-bold text-lg">
          Today&apos;s Daily WTF
        </h3>
      </div>

      <div className="p-6 text-black">
        {featuredProduct && (
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-black/5">
              <Image
                src={featuredProduct.imageUrl}
                alt={featuredProduct.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2 text-black">
                {featuredProduct.title}
              </h4>
              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                {featuredProduct.description}
              </p>
              
              <a
                href={featuredProduct.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300"
              >
                Get This WTF Thing
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}