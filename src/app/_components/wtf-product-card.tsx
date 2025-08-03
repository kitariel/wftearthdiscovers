"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import { BookmarkButton } from "./bookmark-button";
import { CollectionSelector, CollectionBadge } from "./collection-selector";
import { ShareButton } from "./share-button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useErrorToast } from "@/components/ui/toast";
import { ErrorBoundary, ProductErrorFallback } from "@/components/ui/error-boundary";
import { ProductRecommendations } from "./product-recommendations";

type WtfProduct = RouterOutputs["wtfProduct"]["getRandom"];

function WtfProductCardContent() {
  const [currentProduct, setCurrentProduct] = useState<WtfProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorToast = useErrorToast();

  const randomProductQuery = api.wtfProduct.getRandom.useQuery(undefined, {
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleShowAnother = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await randomProductQuery.refetch();
      if (result.data) {
        setCurrentProduct(result.data);
      } else if (result.error) {
        throw new Error(result.error.message);
      } else {
        throw new Error("No product data received");
      }
    } catch (error) {
      console.error("Failed to fetch random product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load product";
      setError(errorMessage);
      errorToast("Load Failed", "Couldn't load a new product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial product
  const { data: initialProduct, isLoading: initialLoading, error: initialError } = api.wtfProduct.getRandom.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const displayProduct = currentProduct ?? initialProduct;

  // Show loading state for initial load
  if (initialLoading && !displayProduct) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-8 text-black shadow-sm">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-black"></div>
        <h2 className="mb-2 text-2xl font-bold">Loading WTF Product...</h2>
        <p className="text-center text-gray-600">
          Finding something weird for you...
        </p>
      </div>
    );
  }

  // Show error state
  if (initialError && !displayProduct) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mb-4 text-6xl">😵</div>
        <h2 className="mb-2 text-2xl font-bold text-red-800">Failed to Load Product</h2>
        <p className="mb-4 text-center text-red-600">
          We couldn&apos;t load any products right now. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show empty state
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
    <div className="space-y-8">
      {/* Main WTF Product Card */}
      <div className="mx-auto max-w-lg relative overflow-hidden rounded-2xl shadow-xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 text-center">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">
            🌍 WTF Earth Discovers
          </h1>
        </div>

        {/* Full Card Image Background */}
        <div className="relative aspect-[3/4] bg-gray-50">
          <ImageWithFallback
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

          {/* Share and Collection Buttons */}
          <div className="absolute top-20 right-4 flex gap-2">
            <ShareButton 
              title={displayProduct.title}
              text={`Check out this amazing product: ${displayProduct.title}`}
              url={`${window.location.origin}?product=${displayProduct.id}`}
            />
            <CollectionSelector product={displayProduct} />
          </div>

          {/* Floating Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white leading-tight drop-shadow-lg">
              {displayProduct.title}
            </h2>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {displayProduct.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white border border-white/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Collection Badges */}
            <div className="mb-6">
              <CollectionBadge product={displayProduct} maxVisible={3} />
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
              {error && (
                <div className="mt-2 rounded-lg bg-red-500/20 border border-red-300/30 px-3 py-2 text-sm text-red-100">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mx-auto max-w-4xl">
        <ProductRecommendations productId={displayProduct.id} limit={4} />
      </div>
    </div>
  );
}

export function WtfProductCard() {
  return (
    <ErrorBoundary fallback={ProductErrorFallback}>
      <WtfProductCardContent />
    </ErrorBoundary>
  );
}
