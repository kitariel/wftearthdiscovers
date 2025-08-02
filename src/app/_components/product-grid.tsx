"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/trpc/react";
import Image from "next/image";
import type { RouterOutputs } from "@/trpc/react";
import { FilterSidebar } from "./filter-sidebar";
import { BookmarkButton } from "./bookmark-button";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

// Product Card Component (unchanged)
function ProductCard({ product }: { product: WtfProduct }) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative aspect-[4/4] bg-gray-50">
        <Image
          src={product.imageUrl || ""}
          alt={product.title}
          objectFit="cover"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          height={300}
          width={300}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        {/* {product.isFeatured && (
          <div className="absolute top-3 right-3 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
            ⭐
          </div>
        )} */}

        <div className="absolute top-3 left-3">
          <BookmarkButton product={product} size="sm" variant="filled" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="mb-3 line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg">
            {product.title}
          </h3>

          <div className="mb-4 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="self-center text-xs text-white/80">
                +{product.tags.length - 2}
              </span>
            )}
          </div>

          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
          >
            🛒 Check It Out
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<WtfProduct[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [seed, setSeed] = useState<number>(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const LIMIT = 6;

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = api.wtfProduct.getInfiniteScroll.useQuery({
    limit: LIMIT,
    offset: currentOffset,
    seed: seed, // Keep the same seed for consistent ordering
    ...(selectedCategory && { category: selectedCategory }),
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // FIXED: Handle API response without sliding window complexity
  useEffect(() => {
    if (apiResponse?.products && Array.isArray(apiResponse.products)) {
      setDisplayedProducts((prev) => {
        // For initial load (offset 0), replace all products
        if (currentOffset === 0) {
          return apiResponse.products;
        }

        // For load more, append new products and filter duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newUniqueProducts = apiResponse.products.filter(
          (p) => !existingIds.has(p.id),
        );
        return [...prev, ...newUniqueProducts];
      });

      setHasMore(apiResponse.hasMore ?? false);
      setIsLoadingMore(false);
    }
  }, [apiResponse, currentOffset]);

  const loadInitialProducts = useCallback(() => {
    setCurrentOffset(0);
    setSeed(Date.now()); // New seed for shuffle
    setHasMore(true);
    setDisplayedProducts([]); // Clear existing products
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true);
      setCurrentOffset((prev) => prev + LIMIT);
    }
  }, [hasMore, isLoadingMore, isLoading]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Load initial products on mount or category change
  useEffect(() => {
    loadInitialProducts();
  }, [selectedCategory, loadInitialProducts]);

  // Listen for shuffle events from floating button
  useEffect(() => {
    const handleShuffleEvent = () => {
      loadInitialProducts();
    };

    window.addEventListener("shuffle-products", handleShuffleEvent);
    return () => {
      window.removeEventListener("shuffle-products", handleShuffleEvent);
    };
  }, [loadInitialProducts]);

  if (isLoading && currentOffset === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
        <p className="text-gray-500">Loading WTF products...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">
          {selectedCategory
            ? `${selectedCategory} Products`
            : "All WTF Products"}
        </h2>
        <FilterSidebar
          onShuffle={loadInitialProducts}
          onCategoryFilter={handleCategoryFilter}
          selectedCategory={selectedCategory}
        />
      </div>

      {!displayedProducts || displayedProducts.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-gray-50 py-8 text-center text-gray-500">
          <p className="text-lg font-medium text-black">No WTF Products Yet!</p>
          <p className="text-sm text-gray-500">
            Add some products using the admin form.
          </p>
        </div>
      ) : (
        // FIXED: Always use infinite scroll, remove mobile-specific logic
        <InfiniteScroll
          dataLength={displayedProducts.length}
          next={loadMoreProducts}
          hasMore={hasMore}
          loader={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
              <p className="text-gray-500">Loading more products...</p>
            </div>
          }
          endMessage={
            <div className="py-8 text-center text-gray-500">
              <p>You&apos;ve seen all the amazing products!</p>
            </div>
          }
          // FIXED: Add scrollThreshold to trigger loading earlier
          scrollThreshold={0.8}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {(!displayedProducts || displayedProducts.length === 0) &&
        selectedCategory &&
        !isLoading && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No products found in the {selectedCategory} category.
            </p>
          </div>
        )}
    </div>
  );
}
