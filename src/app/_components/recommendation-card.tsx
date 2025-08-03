"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "./bookmark-button";
import { CollectionSelector, CollectionBadge } from "./collection-selector";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

interface RecommendationCardProps {
  product: WtfProduct;
  sharedTags?: string[];
  score?: number;
}

export function RecommendationCard({
  product,
  sharedTags = [],
  score = 0,
}: RecommendationCardProps) {
  const truncatedDescription = product.description.length > 80 
    ? product.description.substring(0, 80) + "..." 
    : product.description;

  return (
    <div className="group h-full bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="p-3">
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <BookmarkButton product={product} size="sm" />
            <CollectionSelector product={product} className="scale-75" />
          </div>
          {score > 0 && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {score} match{score > 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {product.title}
          </h3>
          
          {/* Collection Badges */}
          <CollectionBadge product={product} maxVisible={1} className="mb-1" />
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {truncatedDescription}
          </p>
          
          {sharedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sharedTags.slice(0, 2).map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700">
                  {tag}
                </span>
              ))}
              {sharedTags.length > 2 && (
                <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700">
                  +{sharedTags.length - 2}
                </span>
              )}
            </div>
          )}
          
          <Button 
            asChild 
            size="sm" 
            className="w-full text-xs h-8"
          >
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1"
            >
              <span>View Product</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}