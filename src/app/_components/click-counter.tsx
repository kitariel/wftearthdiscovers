"use client";

import { Eye } from "lucide-react";

interface ClickCounterProps {
  clickCount: number;
  className?: string;
}

export function ClickCounter({ clickCount, className = "" }: ClickCounterProps) {
  // Don't show if no clicks yet
  if (clickCount === 0) return null;

  // Format large numbers (1000+ becomes 1k, etc.)
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div 
      className={`inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm ${className}`}
      title={`${clickCount.toLocaleString()} people viewed this product`}
    >
      <Eye className="h-3 w-3" />
      <span>{formatCount(clickCount)}</span>
    </div>
  );
}