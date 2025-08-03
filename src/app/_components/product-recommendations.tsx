"use client";

import { api } from "@/trpc/react";
import { RecommendationCard } from "./recommendation-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorToast } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface ProductRecommendationsProps {
  productId: string;
  limit?: number;
}

function ProductRecommendationsContent({ productId, limit = 4 }: ProductRecommendationsProps) {
  const errorToast = useErrorToast();
  
  const { data: recommendations, isLoading, error } = api.wtfProduct.getRecommendations.useQuery(
    { productId, limit },
    {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Handle errors with toast
  if (error) {
    console.error("Failed to load recommendations:", error);
    errorToast("Failed to load recommendations. Please try again.");
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">⚠️ Failed to load recommendations</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">🔍 No similar products found</div>
        <p className="text-sm text-gray-400">
          This product is truly unique!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {recommendations.map((product) => (
        <RecommendationCard
          key={product.id}
          product={product}
          sharedTags={product.sharedTags}
          score={product.score}
        />
      ))}
    </div>
  );
}

export function ProductRecommendations({ productId, limit = 4 }: ProductRecommendationsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">More Like This</h3>
        <span className="text-sm text-gray-500">✨</span>
      </div>
      
      <ErrorBoundary 
        fallback={({ error, resetError }) => (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">⚠️ Something went wrong loading recommendations</div>
            <button 
              onClick={resetError}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        )}
      >
        <ProductRecommendationsContent productId={productId} limit={limit} />
      </ErrorBoundary>
    </div>
  );
}