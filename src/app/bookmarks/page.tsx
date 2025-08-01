"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBookmarks, removeBookmark, clearBookmarks, type BookmarkedProduct } from "@/lib/bookmarks";
import { BookmarkButton } from "../_components/bookmark-button";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedProduct[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setBookmarks(getBookmarks());
  }, []);

  const handleRemoveBookmark = (productId: string) => {
    removeBookmark(productId);
    setBookmarks(getBookmarks());
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove all bookmarks?")) {
      clearBookmarks();
      setBookmarks([]);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">My Bookmarks</h1>
            <p className="text-gray-600">Loading your saved WTF products...</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">My Bookmarks</h1>
            <p className="text-gray-600">
              {bookmarks.length === 0 
                ? "No bookmarks yet. Start exploring and save your favorite WTF products!"
                : `${bookmarks.length} saved WTF product${bookmarks.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/"
              className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold text-black transition-colors duration-300 hover:bg-gray-50"
            >
              ← Back to Home
            </Link>
            
            {bookmarks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-red-700"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-gray-50 p-8 text-black">
            <div className="mb-4 text-6xl">📚</div>
            <h2 className="mb-2 text-2xl font-bold">No Bookmarks Yet!</h2>
            <p className="text-center text-gray-600 mb-6">
              Start exploring and bookmark your favorite WTF products to see them here.
            </p>
            <Link 
              href="/"
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
            >
              Explore WTF Products
            </Link>
          </div>
        ) : (
          /* Bookmarks Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((product) => (
              <div key={product.id} className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-50">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
                      ★ Daily WTF
                    </div>
                  )}
                  
                  {/* Bookmark Button */}
                  <div className="absolute top-3 left-3">
                    <BookmarkButton 
                      product={product} 
                      size="sm" 
                      variant="filled"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {product.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
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
                  
                  {/* Bookmarked Date */}
                  <p className="text-xs text-gray-500 mb-3">
                    Saved {new Date(product.bookmarkedAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-black text-white text-sm font-semibold py-2 px-3 rounded hover:bg-gray-800 transition-colors duration-300"
                    >
                      Buy This WTF
                    </a>
                    
                    <button
                      onClick={() => handleRemoveBookmark(product.id)}
                      className="bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded hover:bg-red-700 transition-colors duration-300"
                      title="Remove bookmark"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}