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
export function addBookmark(product: WtfProduct): void {
  if (typeof window === "undefined") return;
  
  try {
    const bookmarks = getBookmarks();
    const bookmarkedProduct: BookmarkedProduct = {
      ...product,
      bookmarkedAt: new Date().toISOString(),
    };
    
    // Check if already bookmarked
    if (!bookmarks.some(bookmark => bookmark.id === product.id)) {
      bookmarks.unshift(bookmarkedProduct); // Add to beginning
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent("bookmark-changed"));
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
}

// Remove a product from bookmarks
export function removeBookmark(productId: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const bookmarks = getBookmarks();
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== productId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("bookmark-changed"));
  } catch (error) {
    console.error("Error removing bookmark:", error);
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