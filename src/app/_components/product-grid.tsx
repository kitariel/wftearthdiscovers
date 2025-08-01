"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/trpc/react";
import Image from "next/image";
import type { RouterOutputs } from "@/trpc/react";
import { FilterSidebar } from "./filter-sidebar";
import { BookmarkButton } from "./bookmark-button";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

export function ProductGrid() {
  const [products, setProducts] = useState<WtfProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: allProducts, isLoading, refetch } = api.wtfProduct.getAll.useQuery();

  const loadRandomProducts = useCallback(() => {
    if (allProducts && allProducts.length > 0) {
      let filteredProducts = allProducts;
      
      // Apply category filter if selected
      if (selectedCategory) {
        filteredProducts = allProducts.filter(product => 
          product.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
        );
      }
      
      // Shuffle and take 12 products
      const shuffled = [...filteredProducts].sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 12));
    }
  }, [allProducts, selectedCategory]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Load initial products when data is available
  useEffect(() => {
    if (allProducts && products.length === 0) {
      loadRandomProducts();
    }
  }, [allProducts, products.length, selectedCategory, loadRandomProducts]);

  // Listen for shuffle events from floating button
  useEffect(() => {
    const handleShuffleEvent = () => {
      loadRandomProducts();
    };

    window.addEventListener('shuffle-products', handleShuffleEvent);
    return () => {
      window.removeEventListener('shuffle-products', handleShuffleEvent);
    };
  }, [loadRandomProducts]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-500">Loading WTF products...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">
          {selectedCategory ? `${selectedCategory} Products` : "All WTF Products"}
        </h2>
        <FilterSidebar 
           onShuffle={loadRandomProducts}
           onCategoryFilter={handleCategoryFilter}
           selectedCategory={selectedCategory}
         />
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border border-black/10 rounded-lg bg-gray-50">
          <p className="text-lg font-medium text-black">No WTF Products Yet!</p>
          <p className="text-sm text-gray-500">Add some products using the admin form.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-black/10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-40 bg-gray-50">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ★
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <BookmarkButton 
                    product={product} 
                    size="sm" 
                    variant="filled"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-black mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {product.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full border border-black/10"
                    >
                      #{tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.tags.length - 3}</span>
                  )}
                </div>

                {/* Buy Button */}
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-black text-white text-xs font-semibold py-2 px-3 rounded hover:bg-gray-800 transition-colors duration-300"
                >
                  Buy This WTF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {products.length === 0 && selectedCategory && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in the {selectedCategory} category.</p>
        </div>
      )}
    </div>
  );
}