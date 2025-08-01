"use client";

import React from "react";
import { Shuffle } from "lucide-react";

export function FloatingShuffleButton() {
  const handleShuffle = () => {
    // Trigger a custom event that the ProductGrid can listen to
    window.dispatchEvent(new CustomEvent('shuffle-products'));
  };

  return (
    <button
      onClick={handleShuffle}
      className="fixed bottom-36 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      title="Shuffle products"
    >
      <Shuffle className="h-5 w-5" />
    </button>
  );
}