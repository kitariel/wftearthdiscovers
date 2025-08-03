"use client";

import Link from "next/link";
import { Home, Bookmark, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { getBookmarkCount } from "@/lib/bookmarks";
import { getCollections } from "@/lib/bookmark-collections";

export function Header() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateCounts = () => {
      setBookmarkCount(getBookmarkCount());
      const collections = getCollections();
      setCollectionCount(collections.filter(c => !c.isDefault).length);
    };
    
    // Initial count
    updateCounts();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wtf-bookmarks" || e.key === "wtf-bookmark-collections") {
        updateCounts();
      }
    };
    
    // Listen for custom events
    const handleBookmarkChange = () => {
      updateCounts();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bookmark-changed", handleBookmarkChange);
    
    // Update count periodically
    const interval = setInterval(updateCounts, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bookmark-changed", handleBookmarkChange);
      clearInterval(interval);
    };
  }, []);

  if (!isClient) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black">
            🌍 WTF Earth
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </Link>
            <Link href="/collections" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Collections</span>
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black hover:text-gray-700 transition-colors">
          🌍 WTF Earth
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link 
            href="/bookmarks" 
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium relative"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {bookmarkCount > 99 ? "99+" : bookmarkCount}
              </span>
            )}
          </Link>
          
          <Link 
            href="/collections" 
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium relative"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Collections</span>
            {collectionCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {collectionCount > 9 ? "9+" : collectionCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}