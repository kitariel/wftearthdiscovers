"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit3, Trash2, Folder } from "lucide-react";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  getCollections,
  COLLECTION_COLORS,
  type BookmarkCollection,
} from "@/lib/bookmark-collections";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCollection?: BookmarkCollection | null;
  onCollectionChange: () => void;
}

export function CollectionModal({
  isOpen,
  onClose,
  editingCollection,
  onCollectionChange,
}: CollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLLECTION_COLORS[0] ?? "#3B82F6");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or editing collection changes
  useEffect(() => {
    if (isOpen) {
      if (editingCollection) {
        setName(editingCollection.name);
        setDescription(editingCollection.description ?? "");
        setSelectedColor(editingCollection.color);
      } else {
        setName("");
        setDescription("");
        setSelectedColor(COLLECTION_COLORS[0] ?? "#3B82F6");
      }
      setError("");
    }
  }, [isOpen, editingCollection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let result;
      if (editingCollection) {
        result = updateCollection(editingCollection.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          color: selectedColor,
        });
      } else {
        result = createCollection(
          name.trim(),
          description.trim() || undefined,
          selectedColor
        );
      }

      if (result.success) {
        onCollectionChange();
        onClose();
      } else {
        setError(result.error ?? "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingCollection || editingCollection.isDefault) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${editingCollection.name}"? This will remove all bookmarks from this collection.`
    );

    if (!confirmed) return;

    setIsLoading(true);
    const result = deleteCollection(editingCollection.id);

    if (result.success) {
      onCollectionChange();
      onClose();
    } else {
      setError(result.error ?? "Failed to delete collection");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCollection ? "Edit Collection" : "Create Collection"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Collection Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Collection Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter collection name"
              disabled={isLoading || (editingCollection?.isDefault ?? false)}
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe your collection"
              disabled={isLoading}
              maxLength={200}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLLECTION_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-900 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            {/* Delete Button (only for editing non-default collections) */}
            {editingCollection && !editingCollection.isDefault && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}

            {/* Submit and Cancel */}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : editingCollection ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {editingCollection ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Collection List Component for managing collections
interface CollectionListProps {
  collections: BookmarkCollection[];
  selectedCollectionId: string;
  onSelectCollection: (collectionId: string) => void;
  onEditCollection: (collection: BookmarkCollection) => void;
  onCreateCollection: () => void;
}

export function CollectionList({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onEditCollection,
  onCreateCollection,
}: CollectionListProps) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Collections</h3>
        <button
          onClick={onCreateCollection}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>

      {/* Collection Items */}
      <div className="space-y-1">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className={`group flex items-center justify-between rounded-lg border p-3 transition-all ${
              selectedCollectionId === collection.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <button
              onClick={() => onSelectCollection(collection.id)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <div
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: collection.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{collection.name}</p>
                {collection.description && (
                  <p className="text-sm text-gray-500 truncate">{collection.description}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">{collection.bookmarkCount}</span>
            </button>

            {/* Edit Button */}
            {!collection.isDefault && (
              <button
                onClick={() => onEditCollection(collection)}
                className="ml-2 rounded-md p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {collections.length === 1 && (
        <div className="text-center py-8">
          <Folder className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Create collections to organize your bookmarks
          </p>
        </div>
      )}
    </div>
  );
}