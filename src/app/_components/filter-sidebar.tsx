"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Filter, Shuffle } from "lucide-react";
import { api } from "@/trpc/react";
import { useErrorToast } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface FilterSidebarProps {
  onShuffle: () => void;
  onCategoryFilter: (category: string | null) => void;
  selectedCategory: string | null;
}

function FilterSidebarContent({ onShuffle, onCategoryFilter, selectedCategory }: FilterSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const errorToast = useErrorToast();
  const { data: tags, isLoading: tagsLoading, error } = api.wtfProduct.getAllTags.useQuery(
    undefined,
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Failed to load tags:", error);
      errorToast("Load Failed", "Failed to load categories. Some filters may not be available.");
    }
  }, [error, errorToast]);
  
  // Create categories array with "All Products" first, then all unique tags
  const categories = React.useMemo(() => {
    if (!tags) return ["All Products"];
    return ["All Products", ...tags];
  }, [tags]);

  const handleCategoryClick = (category: string) => {
    if (category === "All Products") {
      onCategoryFilter(null);
    } else {
      onCategoryFilter(category);
    }
    setOpen(false);
  };

  const handleShuffleClick = () => {
    onShuffle();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Shuffle Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Actions</h3>
            <Button 
              onClick={handleShuffleClick}
              variant="outline" 
              className="w-full gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle Products
            </Button>
          </div>

          <Separator />

          {/* Category Filter Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {tagsLoading ? (
                <div className="text-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mx-auto"></div>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Failed to load categories
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                categories.map((category) => {
                  const isSelected = category === "All Products" 
                    ? selectedCategory === null 
                    : selectedCategory === category;
                  
                  return (
                    <Button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      variant={isSelected ? "default" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      {category}
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <ErrorBoundary fallback={() => (
      <div className="w-64 border-r bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="text-center py-8">
          <div className="text-2xl mb-2">💥</div>
          <p className="text-sm text-muted-foreground mb-3">
            Something went wrong with the filters
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    )}>
      <FilterSidebarContent {...props} />
    </ErrorBoundary>
  );
}