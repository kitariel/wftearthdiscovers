"use client";

import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]>;

const BOOKMARKS_KEY = "wtf-bookmarks";

export interface BookmarkedProduct {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  tags: string[];
  isFeatured: boolean;
  platformType: string;
  createdAt: Date;
  bookmarkedAt: string;
}

// Get all bookmarks from localStorage
export function getBookmarks(): BookmarkedProduct[] {
  if (typeof window === "undefined") return [];
  
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? (JSON.parse(bookmarks) as BookmarkedProduct[]) : [];
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return [];
  }
}

// Add a product to bookmarks
export function addBookmark(product: WtfProduct & { platformType?: string }): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const bookmarks = getBookmarks();
    const bookmarkedProduct: BookmarkedProduct = {
      ...product,
      platformType: product.platformType ?? "Amazon",
      bookmarkedAt: new Date().toISOString(),
    };
    
    // Check if already bookmarked
    if (bookmarks.some(bookmark => bookmark.id === product.id)) {
      return { success: false, error: "Product is already bookmarked" };
    }
    
    bookmarks.unshift(bookmarkedProduct); // Add to beginning
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("bookmark-changed"));
    
    return { success: true };
  } catch (error) {
    console.error("Error adding bookmark:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to add bookmark";
    return { success: false, error: errorMessage };
  }
}

// Remove a product from bookmarks
export function removeBookmark(productId: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const bookmarks = getBookmarks();
    const initialLength = bookmarks.length;
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== productId);
    
    if (updatedBookmarks.length === initialLength) {
      return { success: false, error: "Product was not bookmarked" };
    }
    
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("bookmark-changed"));
    
    return { success: true };
  } catch (error) {
    console.error("Error removing bookmark:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to remove bookmark";
    return { success: false, error: errorMessage };
  }
}

// Check if a product is bookmarked
export function isBookmarked(productId: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const bookmarks = getBookmarks();
    return bookmarks.some(bookmark => bookmark.id === productId);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
}

// Clear all bookmarks
export function clearBookmarks(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(BOOKMARKS_KEY);
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("bookmark-changed"));
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
}

// Get bookmark count
export function getBookmarkCount(): number {
  return getBookmarks().length;
}