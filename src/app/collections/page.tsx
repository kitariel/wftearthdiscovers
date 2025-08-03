"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Folder, ArrowLeft } from "lucide-react";
import {
  getCollections,
  deleteCollection,
  getCollectionProducts,
  type BookmarkCollection,
} from "@/lib/bookmark-collections";
import { CollectionModal } from "@/app/_components/collection-modal";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { BookmarkButton } from "@/app/_components/bookmark-button";
import { CollectionSelector } from "@/app/_components/collection-selector";
import { ShareButton } from "@/app/_components/share-button";
import { useClickTracker } from "@/lib/hooks/use-click-tracker";
import { ClickCounter } from "@/app/_components/click-counter";
import type { RouterOutputs } from "@/trpc/react";

type WtfProduct = NonNullable<RouterOutputs["wtfProduct"]["getRandom"]> & {
  clickCount?: number;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<BookmarkCollection | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<BookmarkCollection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<WtfProduct[]>([]);
  const { trackClick } = useClickTracker();

  const handleProductClick = async (product: WtfProduct) => {
    await trackClick(product.id);
    window.open(product.affiliateLink, '_blank');
  };

  // Load collections
  useEffect(() => {
    const loadCollections = () => {
      const allCollections = getCollections();
      setCollections(allCollections);
    };

    loadCollections();
    
    // Listen for storage changes
    const handleStorageChange = () => loadCollections();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load products for selected collection
  useEffect(() => {
    if (selectedCollection) {
      const products = getCollectionProducts(selectedCollection.id);
      setCollectionProducts(products);
    }
  }, [selectedCollection]);

  const handleCreateCollection = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleEditCollection = (collection: BookmarkCollection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleDeleteCollection = (collection: BookmarkCollection) => {
    if (collection.isDefault) {
      alert("Cannot delete the default collection");
      return;
    }

    if (confirm(`Are you sure you want to delete "${collection.name}"? This will remove all products from this collection.`)) {
      deleteCollection(collection.id);
      const updatedCollections = getCollections();
      setCollections(updatedCollections);
      
      // If we're viewing the deleted collection, go back to collections list
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    // Refresh collections
    const updatedCollections = getCollections();
    setCollections(updatedCollections);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    setCollectionProducts([]);
  };

  // If viewing a specific collection
  if (selectedCollection) {
    return (
      <main className="min-h-screen bg-gray-100 pt-8 px-8 pb-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToCollections}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedCollection.color }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-black">{selectedCollection.name}</h1>
                  {selectedCollection.description && (
                    <p className="text-gray-600">{selectedCollection.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {collectionProducts.length} item{collectionProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <ShareButton 
                title={`${selectedCollection.name} Collection`}
                text={`Check out my curated collection: ${selectedCollection.name} - ${collectionProducts.length} amazing products!`}
                url={`${window.location.origin}/collections?collection=${selectedCollection.id}`}
              />
            </div>
          </div>

          {/* Products Grid */}
          {collectionProducts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-gray-50 p-8 text-black">
              <div className="mb-4 text-6xl">📁</div>
              <h2 className="mb-2 text-2xl font-bold">Collection is Empty</h2>
              <p className="mb-6 text-center text-gray-600">
                Start adding products to this collection from the product pages.
              </p>
              <Link
                href="/"
                className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {collectionProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative aspect-[4/4] bg-gray-50">
                    <ImageWithFallback
                      src={product.imageUrl ?? ""}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Bookmark Button and Click Counter */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <BookmarkButton product={product} size="sm" variant="filled" />
                      <ClickCounter clickCount={product.clickCount ?? 0} />
                    </div>

                    {/* Share and Collection Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <ShareButton 
                        title={product.title}
                        text={`Check out this amazing product: ${product.title}`}
                        url={`${window.location.origin}?product=${product.id}`}
                        className="scale-75"
                      />
                      <CollectionSelector product={product} className="scale-75" />
                    </div>

                    {/* Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="mb-3 line-clamp-2 text-lg font-bold text-white drop-shadow-lg">
                        {product.title}
                      </h3>

                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="self-center text-xs text-white/80">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleProductClick(product)}
                        className="block w-full rounded-lg bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
                      >
                        🛒 Check It Out
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Collections overview page
  return (
    <main className="min-h-screen bg-gray-100 pt-8 px-8 pb-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">My Collections</h1>
            <p className="text-gray-600">
              Organize your bookmarked products into collections
            </p>
          </div>
          <button
            onClick={handleCreateCollection}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-gray-50 p-8 text-black">
            <div className="mb-4 text-6xl">📚</div>
            <h2 className="mb-2 text-2xl font-bold">No Collections Yet!</h2>
            <p className="mb-6 text-center text-gray-600">
              Create your first collection to organize your bookmarked products.
            </p>
            <button
              onClick={handleCreateCollection}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
            >
              Create Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Collection Header */}
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-6 w-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: collection.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {!collection.isDefault && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditCollection(collection)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit collection"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollection(collection)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete collection"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      {collection.bookmarkCount} item{collection.bookmarkCount !== 1 ? 's' : ''}
                    </span>
                    {collection.isDefault && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        Default
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => setSelectedCollection(collection)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    View Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Modal */}
        <CollectionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          editingCollection={editingCollection}
          onCollectionChange={handleModalClose}
        />
      </div>
    </main>
  );
}