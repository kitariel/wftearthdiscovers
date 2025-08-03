"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { api } from "@/trpc/react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  type: "product" | "tag" | "history";
  text: string;
}

export function SearchBar({
  onSearch,
  onClear,
  placeholder = "Search products...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use a simple debounce implementation to avoid type issues
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wtf-search-history");
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          setSearchHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, []);

  // Get all tags for suggestions
  const { data: tagsData } = api.wtfProduct.getAllTags.useQuery();

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show search history and popular tags when no query
      const historySuggestions: SearchSuggestion[] = searchHistory
        .slice(0, 3)
        .map((item) => ({
          type: "history",
          text: item,
        }));

      const popularTags: SearchSuggestion[] = (tagsData ?? [])
        .slice(0, 5)
        .map((tag) => ({
          type: "tag",
          text: tag,
        }));

      setSuggestions([...historySuggestions, ...popularTags]);
    } else {
      // Filter tags based on query
      const matchingTags: SearchSuggestion[] = (tagsData ?? [])
        .filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((tag) => ({
          type: "tag",
          text: tag,
        }));

      // Add query as a search suggestion
      const querySuggestion: SearchSuggestion = {
        type: "product",
        text: query,
      };

      setSuggestions([querySuggestion, ...matchingTags]);
    }
  }, [query, tagsData, searchHistory]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // Save to search history
  const saveToHistory = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      const newHistory = [
        trimmedQuery,
        ...searchHistory.filter((item) => item !== trimmedQuery),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      try {
        localStorage.setItem("wtf-search-history", JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save search history:", error);
      }
    },
    [searchHistory],
  );

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    saveToHistory(suggestion.text);
    onSearch(suggestion.text);
    inputRef.current?.blur();
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query);
      onSearch(query);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    onClear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("wtf-search-history");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {!query.trim() && searchHistory.length > 0 && (
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              {suggestion.type === "history" && (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              {suggestion.type === "tag" && (
                <TrendingUp className="h-4 w-4 text-blue-500" />
              )}
              {suggestion.type === "product" && (
                <Search className="h-4 w-4 text-gray-400" />
              )}

              <div className="flex-1">
                <span className="text-sm text-gray-900">{suggestion.text}</span>
              </div>
            </button>
          ))}

          {!query.trim() && tagsData && tagsData.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <span className="text-xs font-medium text-gray-500">
                Popular Tags
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
