"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/react";
import { BookmarkButton } from "./bookmark-button";
import { CollectionSelector, CollectionBadge } from "./collection-selector";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useErrorToast } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { RecommendationsModal, useRecommendationsModal } from "./recommendations-modal";
import { Sparkles, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

interface SearchResultsProps {
  query: string;
  selectedCategory?: string;
}

function SearchResultCard({ product, onShowRecommendations }: { product: WtfProduct; onShowRecommendations: (product: WtfProduct) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative aspect-[4/4] bg-gray-50">
        <ImageWithFallback
          src={product.imageUrl || ""}
          alt={product.title}
          objectFit="cover"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          height={300}
          width={300}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3">
          <BookmarkButton product={product} size="sm" variant="filled" />
        </div>

        <div className="absolute top-3 right-3">
          <CollectionSelector product={product} className="scale-75" />
        </div>

        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="mb-3 line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg">
            {product.title}
          </h3>

          <div className="mb-3 flex flex-wrap gap-1">
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

          {/* Collection Badges */}
          <div className="mb-3">
            <CollectionBadge product={product} maxVisible={2} />
          </div>

          <div className="flex gap-2">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
            >
              🛒 Check It Out
            </a>
            <button
              onClick={() => onShowRecommendations(product)}
              className="rounded-lg bg-blue-600/90 px-3 py-2.5 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600"
              title="More Like This"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsContent({ query, selectedCategory }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "oldest" | "title">("relevance");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [allResults, setAllResults] = useState<WtfProduct[]>([]);
  const errorToast = useErrorToast();
  const { isOpen, selectedProduct, openModal, closeModal } = useRecommendationsModal();
  
  const LIMIT = 12;

  const {
    data: searchResponse,
    isLoading,
    error,
    refetch,
  } = api.wtfProduct.search.useQuery({
    query,
    limit: LIMIT,
    offset: currentOffset,
    sortBy,
    ...(selectedCategory && { category: selectedCategory }),
  }, {
    enabled: !!query.trim(),
    retry: 2,
  });

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Search failed:", error);
      errorToast("Search Failed", "Failed to search products. Please try again.");
    }
  }, [error, errorToast]);

  // Reset results when query or sort changes
  useEffect(() => {
    setCurrentOffset(0);
    setAllResults([]);
  }, [query, sortBy, selectedCategory]);

  // Accumulate results
  useEffect(() => {
    if (searchResponse?.products) {
      if (currentOffset === 0) {
        setAllResults(searchResponse.products);
      } else {
        setAllResults(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = searchResponse.products.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
    }
  }, [searchResponse, currentOffset]);

  const loadMore = () => {
    if (searchResponse?.hasMore && !isLoading) {
      setCurrentOffset(prev => prev + LIMIT);
    }
  };

  if (!query.trim()) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Enter a search term to find products</p>
      </div>
    );
  }

  if (isLoading && currentOffset === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] rounded-xl bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-8 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to search products. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!allResults.length && !isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          No products found for &ldquo;{query}&rdquo;
          {selectedCategory && ` in ${selectedCategory}`}
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Try different keywords or remove filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results for &ldquo;{query}&rdquo;
          </h2>
          <p className="text-sm text-gray-500">
            {searchResponse?.totalCount} products found
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="relevance">Most Relevant</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allResults.map((product) => (
          <SearchResultCard
            key={product.id}
            product={product}
            onShowRecommendations={openModal}
          />
        ))}
      </div>

      {/* Load More Button */}
      {searchResponse?.hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3"
          >
            {isLoading ? "Loading..." : "Load More Results"}
          </Button>
        </div>
      )}

      {/* Recommendations Modal */}
      {selectedProduct && (
        <RecommendationsModal
          product={selectedProduct}
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export function SearchResults({ query, selectedCategory }: SearchResultsProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="py-12 text-center">
          <p className="text-red-600">Something went wrong with the search.</p>
          <Button onClick={resetError} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    >
      <SearchResultsContent query={query} selectedCategory={selectedCategory} />
    </ErrorBoundary>
  );
}