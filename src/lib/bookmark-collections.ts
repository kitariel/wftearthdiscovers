"use client";

import type { BookmarkedProduct } from "@/lib/bookmarks";
import { getBookmarks, addBookmark, removeBookmark } from "@/lib/bookmarks";

const COLLECTIONS_KEY = "wtf-bookmark-collections";
const COLLECTION_BOOKMARKS_KEY = "wtf-collection-bookmarks";

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  bookmarkCount: number;
}

export interface CollectionBookmark {
  id: string;
  productId: string;
  collectionId: string;
  createdAt: string;
}

// Default collection colors
export const COLLECTION_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6B7280", // Gray
];

// Get all collections from localStorage
export function getCollections(): BookmarkCollection[] {
  if (typeof window === "undefined") return [];
  
  try {
    const collections = localStorage.getItem(COLLECTIONS_KEY);
    const parsed = collections ? (JSON.parse(collections) as BookmarkCollection[]) : [];
    
    // Ensure default collection exists
    if (!parsed.find(c => c.isDefault)) {
      const defaultCollection = createDefaultCollection();
      parsed.unshift(defaultCollection);
      saveCollections(parsed);
    }
    
    // Update bookmark counts
    return parsed.map(collection => ({
      ...collection,
      bookmarkCount: getCollectionBookmarkCount(collection.id)
    }));
  } catch (error) {
    console.error("Error reading collections:", error);
    return [createDefaultCollection()];
  }
}

// Create default "All Bookmarks" collection
function createDefaultCollection(): BookmarkCollection {
  return {
    id: "default",
    name: "All Bookmarks",
    description: "All your saved products",
    color: "#3B82F6",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookmarkCount: 0
  };
}

// Save collections to localStorage
function saveCollections(collections: BookmarkCollection[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error("Error saving collections:", error);
  }
}

// Create a new collection
export function createCollection(name: string, description?: string, color?: string): { success: boolean; collection?: BookmarkCollection; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const collections = getCollections();
    
    // Check if name already exists
    if (collections.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, error: "Collection name already exists" };
    }
    
    const newCollection: BookmarkCollection = {
      id: generateId(),
      name,
      description,
      color: color ?? COLLECTION_COLORS[collections.length % COLLECTION_COLORS.length] ?? "#3B82F6",
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookmarkCount: 0
    };
    
    collections.push(newCollection);
    saveCollections(collections);
    
    return { success: true, collection: newCollection };
  } catch (error) {
    return { success: false, error: "Failed to create collection" };
  }
}

// Update a collection
export function updateCollection(id: string, updates: Partial<Pick<BookmarkCollection, 'name' | 'description' | 'color'>>): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const collections = getCollections();
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) {
      return { success: false, error: "Collection not found" };
    }
    
    // Don't allow updating default collection name
    if (collections[index]?.isDefault && updates.name) {
      return { success: false, error: "Cannot rename default collection" };
    }
    
    // Check for duplicate names
    if (updates.name && collections.some(c => c.id !== id && c.name.toLowerCase() === updates.name?.toLowerCase())) {
      return { success: false, error: "Collection name already exists" };
    }
    
    collections[index] = {
      ...collections[index]!,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveCollections(collections);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update collection" };
  }
}

// Delete a collection
export function deleteCollection(id: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const collections = getCollections();
    const collection = collections.find(c => c.id === id);
    
    if (!collection) {
      return { success: false, error: "Collection not found" };
    }
    
    if (collection.isDefault) {
      return { success: false, error: "Cannot delete default collection" };
    }
    
    // Remove all bookmarks from this collection
    const collectionBookmarks = getCollectionBookmarks();
    const updatedBookmarks = collectionBookmarks.filter(b => b.collectionId !== id);
    saveCollectionBookmarks(updatedBookmarks);
    
    // Remove the collection
    const updatedCollections = collections.filter(c => c.id !== id);
    saveCollections(updatedCollections);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete collection" };
  }
}

// Get collection bookmarks from localStorage
function getCollectionBookmarks(): CollectionBookmark[] {
  if (typeof window === "undefined") return [];
  
  try {
    const bookmarks = localStorage.getItem(COLLECTION_BOOKMARKS_KEY);
    return bookmarks ? (JSON.parse(bookmarks) as CollectionBookmark[]) : [];
  } catch (error) {
    console.error("Error reading collection bookmarks:", error);
    return [];
  }
}

// Save collection bookmarks to localStorage
function saveCollectionBookmarks(bookmarks: CollectionBookmark[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(COLLECTION_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving collection bookmarks:", error);
  }
}

// Add product to collection
export function addToCollection(productId: string, collectionId: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const collectionBookmarks = getCollectionBookmarks();
    
    // Check if already in collection
    if (collectionBookmarks.some(b => b.productId === productId && b.collectionId === collectionId)) {
      return { success: false, error: "Product already in collection" };
    }
    
    const newBookmark: CollectionBookmark = {
      id: generateId(),
      productId,
      collectionId,
      createdAt: new Date().toISOString()
    };
    
    collectionBookmarks.push(newBookmark);
    saveCollectionBookmarks(collectionBookmarks);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add to collection" };
  }
}

// Remove product from collection
export function removeFromCollection(productId: string, collectionId: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Not available on server side" };
  }
  
  try {
    const collectionBookmarks = getCollectionBookmarks();
    const updatedBookmarks = collectionBookmarks.filter(
      b => !(b.productId === productId && b.collectionId === collectionId)
    );
    
    saveCollectionBookmarks(updatedBookmarks);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove from collection" };
  }
}

// Get products in a collection
export function getCollectionProducts(collectionId: string): BookmarkedProduct[] {
  if (typeof window === "undefined") return [];
  
  try {
    const allBookmarks = getBookmarks();
    
    // For default collection, return all bookmarks
    if (collectionId === "default") {
      return allBookmarks;
    }
    
    // For other collections, filter by collection bookmarks
    const collectionBookmarks = getCollectionBookmarks();
    const productIds = collectionBookmarks
      .filter(b => b.collectionId === collectionId)
      .map(b => b.productId);
    
    return allBookmarks.filter(bookmark => productIds.includes(bookmark.id));
  } catch (error) {
    console.error("Error getting collection products:", error);
    return [];
  }
}

// Get bookmark count for a collection
function getCollectionBookmarkCount(collectionId: string): number {
  if (collectionId === "default") {
    return getBookmarks().length;
  }
  
  const collectionBookmarks = getCollectionBookmarks();
  return collectionBookmarks.filter(b => b.collectionId === collectionId).length;
}

// Check if product is in collection
export function isInCollection(productId: string, collectionId: string): boolean {
  if (collectionId === "default") {
    return getBookmarks().some(b => b.id === productId);
  }
  
  const collectionBookmarks = getCollectionBookmarks();
  return collectionBookmarks.some(b => b.productId === productId && b.collectionId === collectionId);
}

// Get collections that contain a product
export function getProductCollections(productId: string): BookmarkCollection[] {
  const collections = getCollections();
  const collectionBookmarks = getCollectionBookmarks();
  
  const collectionIds = collectionBookmarks
    .filter(b => b.productId === productId)
    .map(b => b.collectionId);
  
  return collections.filter(c => c.isDefault || collectionIds.includes(c.id));
}

// Generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Migrate existing bookmarks to default collection
export function migrateExistingBookmarks(): void {
  if (typeof window === "undefined") return;
  
  try {
    const existingBookmarks = getBookmarks();
    const collectionBookmarks = getCollectionBookmarks();
    
    // Add existing bookmarks to default collection if not already there
    const defaultCollectionBookmarks = collectionBookmarks.filter(b => b.collectionId === "default");
    const existingProductIds = new Set(defaultCollectionBookmarks.map(b => b.productId));
    
    const newBookmarks: CollectionBookmark[] = [];
    
    existingBookmarks.forEach(bookmark => {
      if (!existingProductIds.has(bookmark.id)) {
        newBookmarks.push({
          id: generateId(),
          productId: bookmark.id,
          collectionId: "default",
          createdAt: bookmark.bookmarkedAt
        });
      }
    });
    
    if (newBookmarks.length > 0) {
      const updatedBookmarks = [...collectionBookmarks, ...newBookmarks];
      saveCollectionBookmarks(updatedBookmarks);
    }
  } catch (error) {
    console.error("Error migrating bookmarks:", error);
  }
}