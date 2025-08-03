"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Folder } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  getBookmarks,
  removeBookmark,
  clearBookmarks,
  type BookmarkedProduct,
} from "@/lib/bookmarks";
import { BookmarkButton } from "../_components/bookmark-button";
import { CollectionSelector, CollectionBadge } from "../_components/collection-selector";

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
            <h1 className="mb-2 text-3xl font-bold text-black">My Bookmarks</h1>
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
      <div className="container mx-auto px-4 pt-8 pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-black">My Bookmarks</h1>
            <p className="text-gray-600">
              {bookmarks.length === 0
                ? "No bookmarks yet. Start exploring and save your favorite WTF products!"
                : `${bookmarks.length} saved WTF product${bookmarks.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/collections"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
            >
              <Folder className="h-4 w-4" />
              Manage Collections
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
            <p className="mb-6 text-center text-gray-600">
              Start exploring and bookmark your favorite WTF products to see
              them here.
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Full Card Image Background */}
                <div className="relative aspect-[3/4] bg-gray-50">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3 rounded-full bg-black/80 px-2 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                      ⭐ Daily WTF
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

                  {/* Collection Selector */}
                  <div className="absolute top-3 right-3">
                    <CollectionSelector product={product} className="scale-75" />
                  </div>

                  {/* Floating Content */}
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <h3 className="mb-3 line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg">
                      {product.title}
                    </h3>

                    {/* Collection Badges */}
                    <div className="mb-3">
                      <CollectionBadge product={product} maxVisible={2} />
                    </div>

                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {product.tags
                        .slice(0, 2)
                        .map((tag: string, index: number) => (
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

                    {/* Bookmarked Date */}
                    <p className="mb-4 text-xs text-white/80">
                      📅 Saved{" "}
                      {new Date(product.bookmarkedAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-lg bg-white/90 px-3 py-2.5 text-center text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
                      >
                        🛒 Check It Out
                      </a>

                      <button
                        onClick={() => handleRemoveBookmark(product.id)}
                        className="rounded-lg bg-red-600/90 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-red-600"
                        title="Remove bookmark"
                      >
                        🗑️
                      </button>
                    </div>
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
