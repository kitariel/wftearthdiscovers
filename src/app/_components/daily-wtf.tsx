"use client";

import { useEffect } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useErrorToast } from "@/components/ui/toast";
import { ErrorBoundary, ProductErrorFallback } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";

type WtfProduct = RouterOutputs["wtfProduct"]["getDailyFeatured"];

function DailyWtfContent() {
  const errorToast = useErrorToast();
  const { data: featuredProduct, isLoading, error, refetch } =
    api.wtfProduct.getDailyFeatured.useQuery(
      undefined,
      {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      }
    );

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Failed to load daily WTF:", error);
      errorToast("Load Failed", "Failed to load today's featured product. Please try again.");
    }
  }, [error, errorToast]);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-black/10 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="h-6 w-32 rounded bg-gray-200"></div>
        </div>
        <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        <div className="mb-2 text-4xl">⚠️</div>
        <h3 className="mb-2 text-lg font-bold text-red-800">
          Failed to Load Daily WTF
        </h3>
        <p className="text-sm text-red-600 mb-4">
          {error.message}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => void refetch()}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!featuredProduct) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
        <div className="mb-2 text-4xl">📅</div>
        <h3 className="mb-2 text-lg font-bold text-black">
          No Daily WTF Today
        </h3>
        <p className="text-sm text-gray-600">
          Check back tomorrow for more weird finds!
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      {/* Header */}
      <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 text-center">
        <h3 className="text-lg font-bold text-white drop-shadow-lg">
          ⭐ Today&apos;s Daily WTF
        </h3>
      </div>

      <div className="relative aspect-[16/9] bg-gray-50">
        {featuredProduct && (
          <>
            {/* Background Image */}
            <ImageWithFallback
              src={featuredProduct.imageUrl}
              alt={featuredProduct.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Floating Content */}
            <div className="absolute right-0 bottom-0 left-0 p-6">
              <div className="flex items-end gap-4">
                {/* Product Image Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm">
                  <ImageWithFallback
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h4 className="mb-3 text-lg leading-tight font-bold text-white drop-shadow-lg">
                    {featuredProduct.title}
                  </h4>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-1">
                    {featuredProduct.tags
                      .slice(0, 2)
                      .map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    {featuredProduct.tags.length > 2 && (
                      <span className="self-center text-xs text-white/80">
                        +{featuredProduct.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <a
                    href={featuredProduct.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-white/90 px-4 py-2.5 text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
                  >
                    🛒 Get This WTF
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DailyWtf() {
  return (
    <ErrorBoundary fallback={ProductErrorFallback}>
      <DailyWtfContent />
    </ErrorBoundary>
  );
}
