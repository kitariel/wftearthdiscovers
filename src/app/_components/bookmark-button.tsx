"use client";

import { useState, useEffect } from "react";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { useSuccessToast, useErrorToast } from "@/components/ui/toast";
import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

interface BookmarkButtonProps {
  product: WtfProduct;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline";
  className?: string;
}

export function BookmarkButton({ 
  product, 
  size = "md", 
  variant = "filled",
  className = "" 
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  useEffect(() => {
    setIsClient(true);
    setBookmarked(isBookmarked(product.id));
  }, [product.id]);

  const handleBookmarkToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (bookmarked) {
        const result = removeBookmark(product.id);
        if (result.success) {
          setBookmarked(false);
          successToast("Bookmark Removed", "Product removed from your bookmarks");
        } else {
          errorToast("Remove Failed", result.error ?? "Failed to remove bookmark");
        }
      } else {
        const result = addBookmark(product);
        if (result.success) {
          setBookmarked(true);
          successToast("Bookmarked!", "Product added to your bookmarks");
        } else {
          errorToast("Bookmark Failed", result.error ?? "Failed to add bookmark");
        }
      }
    } catch (error) {
      console.error("Bookmark operation failed:", error);
      errorToast("Operation Failed", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <button 
        className={`${getSizeClasses(size)} ${getVariantClasses(variant, false)} ${className}`}
        disabled
      >
        <BookmarkIcon size={size} filled={false} />
      </button>
    );
  }

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className={`${getSizeClasses(size)} ${getVariantClasses(variant, bookmarked)} ${className} transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
      title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
          size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
        }`} />
      ) : (
        <BookmarkIcon size={size} filled={bookmarked} />
      )}
    </button>
  );
}

function BookmarkIcon({ size, filled }: { size: "sm" | "md" | "lg"; filled: boolean }) {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }[size];

  return (
    <svg
      className={sizeClass}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  );
}

function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "p-1.5";
    case "md":
      return "p-2";
    case "lg":
      return "p-3";
    default:
      return "p-2";
  }
}

function getVariantClasses(variant: "filled" | "outline", isBookmarked: boolean): string {
  if (variant === "outline") {
    return isBookmarked
      ? "border border-black/20 bg-black text-white rounded-full"
      : "border border-black/20 bg-white text-black rounded-full hover:bg-gray-50";
  }
  
  return isBookmarked
    ? "bg-black text-white rounded-full"
    : "bg-white text-black border border-black/20 rounded-full hover:bg-gray-50";
}