"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { ProductRecommendations } from "./product-recommendations";
import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

interface RecommendationsModalProps {
  product: WtfProduct;
  isOpen: boolean;
  onClose: () => void;
}

export function RecommendationsModal({ product, isOpen, onClose }: RecommendationsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  More Like &ldquo;{product.title}&rdquo;
                </h2>
                <p className="text-sm text-gray-500">
                  Products with similar tags and vibes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Source Product Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        #{tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <ProductRecommendations productId={product.id} limit={8} />
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for managing modal state
export function useRecommendationsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WtfProduct | null>(null);

  const openModal = (product: WtfProduct) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  return {
    isOpen,
    selectedProduct,
    openModal,
    closeModal,
  };
}