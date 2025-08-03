"use client";

import { api } from "@/trpc/react";
import { useCallback } from "react";

export function useClickTracker() {
  const trackClickMutation = api.wtfProduct.trackClick.useMutation();

  const trackClick = useCallback(
    async (productId: string) => {
      try {
        await trackClickMutation.mutateAsync({ productId });
      } catch (error) {
        // Silently fail - click tracking shouldn't interrupt user experience
        console.warn("Failed to track click:", error);
      }
    },
    [trackClickMutation]
  );

  return {
    trackClick,
    isTracking: trackClickMutation.isPending,
  };
}