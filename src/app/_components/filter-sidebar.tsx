"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Filter, Shuffle } from "lucide-react";

interface FilterSidebarProps {
  onShuffle: () => void;
  onCategoryFilter: (category: string | null) => void;
  selectedCategory: string | null;
}

const categories = [
  "All Products",
  "Weird",
  "Tech", 
  "Food",
  "Kitchen",
  "Gift",
  "Funny",
  "WTF"
];

export function FilterSidebar({ onShuffle, onCategoryFilter, selectedCategory }: FilterSidebarProps) {
  const [open, setOpen] = React.useState(false);

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
              {categories.map((category) => {
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
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}