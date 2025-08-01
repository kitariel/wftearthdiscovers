"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookmarkCount } from "@/lib/bookmarks";

export function FloatingBookmarksButton() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateCount = () => {
      setBookmarkCount(getBookmarkCount());
    };
    
    // Initial count
    updateCount();
    
    // Listen for storage changes (when bookmarks are added/removed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wtf-bookmarks") {
        updateCount();
      }
    };
    
    // Listen for custom bookmark events
    const handleBookmarkChange = () => {
      updateCount();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bookmark-changed", handleBookmarkChange);
    
    // Update count periodically to catch changes within the same tab
    const interval = setInterval(updateCount, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bookmark-changed", handleBookmarkChange);
      clearInterval(interval);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Link
      href="/bookmarks"
      className="fixed bottom-20 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      title={`View bookmarks (${bookmarkCount})`}
    >
      <div className="relative">
        <BookmarkIcon />
        {bookmarkCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {bookmarkCount > 99 ? "99+" : bookmarkCount}
          </span>
        )}
      </div>
    </Link>
  );
}

function BookmarkIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
        clipRule="evenodd"
      />
    </svg>
  );
}