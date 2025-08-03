"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Check, Folder } from "lucide-react";
import {
  getCollections,
  addToCollection,
  removeFromCollection,
  isInCollection,
  getProductCollections,
  type BookmarkCollection,
} from "@/lib/bookmark-collections";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

interface CollectionSelectorProps {
  product: WtfProduct & { platformType?: string };
  onCollectionChange?: () => void;
  className?: string;
}

export function CollectionSelector({
  product,
  onCollectionChange,
  className = "",
}: CollectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [productCollections, setProductCollections] = useState<BookmarkCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load collections and product collections
  useEffect(() => {
    const loadData = () => {
      const allCollections = getCollections();
      const prodCollections = getProductCollections(product.id);
      setCollections(allCollections);
      setProductCollections(prodCollections);
    };

    loadData();
    
    // Listen for storage changes to update collections
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [product.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggleCollection = async (collection: BookmarkCollection) => {
    setIsLoading(true);
    
    try {
      const isCurrentlyInCollection = isInCollection(product.id, collection.id);
      
      if (isCurrentlyInCollection) {
        // Remove from collection
        if (collection.isDefault) {
          // Remove from main bookmarks
          removeBookmark(product.id);
          // Remove from all collections
          collections.forEach(col => {
            if (!col.isDefault) {
              removeFromCollection(product.id, col.id);
            }
          });
        } else {
          // Remove from specific collection
          removeFromCollection(product.id, collection.id);
        }
      } else {
        // Add to collection
        if (collection.isDefault) {
          // Add to main bookmarks
          addBookmark(product);
        } else {
          // Ensure product is bookmarked first
          if (!isBookmarked(product.id)) {
            addBookmark(product);
          }
          // Add to specific collection
          addToCollection(product.id, collection.id);
        }
      }
      
      // Refresh data
      const allCollections = getCollections();
      const prodCollections = getProductCollections(product.id);
      setCollections(allCollections);
      setProductCollections(prodCollections);
      
      onCollectionChange?.();
    } catch (error) {
      console.error('Error toggling collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isProductBookmarked = isBookmarked(product.id);
  const hasCollections = productCollections.length > 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          hasCollections
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        disabled={isLoading}
      >
        <Folder className="h-4 w-4" />
        {hasCollections ? (
          <span>{productCollections.length} collection{productCollections.length !== 1 ? 's' : ''}</span>
        ) : (
          <span>Add to collection</span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {collections.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No collections available
              </div>
            ) : (
              collections.map((collection) => {
                const isInThisCollection = isInCollection(product.id, collection.id);
                
                return (
                  <button
                    key={collection.id}
                    onClick={() => handleToggleCollection(collection)}
                    disabled={isLoading}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    {/* Collection Color */}
                    <div
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: collection.color }}
                    />
                    
                    {/* Collection Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{collection.name}</p>
                      <p className="text-xs text-gray-500">
                        {collection.bookmarkCount} item{collection.bookmarkCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    {/* Checkbox */}
                    <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isInThisCollection
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}>
                      {isInThisCollection && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2">
            <p className="text-xs text-gray-500">
              {isProductBookmarked ? (
                "Product is bookmarked"
              ) : (
                "Adding to a collection will bookmark this product"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini Collection Badge Component
interface CollectionBadgeProps {
  product: WtfProduct;
  maxVisible?: number;
  className?: string;
}

export function CollectionBadge({ 
  product, 
  maxVisible = 2, 
  className = "" 
}: CollectionBadgeProps) {
  const [productCollections, setProductCollections] = useState<BookmarkCollection[]>([]);

  useEffect(() => {
    const loadCollections = () => {
      const collections = getProductCollections(product.id);
      setProductCollections(collections.filter(c => !c.isDefault)); // Don't show default collection
    };

    loadCollections();
    
    // Listen for storage changes
    const handleStorageChange = () => loadCollections();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [product.id]);

  if (productCollections.length === 0) {
    return null;
  }

  const visibleCollections = productCollections.slice(0, maxVisible);
  const remainingCount = productCollections.length - maxVisible;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleCollections.map((collection) => (
        <span
          key={collection.id}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: collection.color }}
          title={collection.description ?? collection.name}
        >
          <div className="h-2 w-2 rounded-full bg-white bg-opacity-30" />
          {collection.name}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}