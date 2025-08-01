"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function AdminForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    affiliateLink: "",
    tags: "",
    isFeatured: false,
  });

  const utils = api.useUtils();
  const createProduct = api.wtfProduct.create.useMutation({
    onSuccess: async () => {
      await utils.wtfProduct.invalidate();
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        affiliateLink: "",
        tags: "",
        isFeatured: false,
      });
      setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
    
    createProduct.mutate({
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      affiliateLink: formData.affiliateLink,
      tags,
      isFeatured: formData.isFeatured,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black hover:bg-gray-800 text-white p-3 rounded-lg shadow-sm transition-colors duration-300 z-50"
      >
        Add WTF Product
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-black/10 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">Add WTF Product</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-xl transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description (Make it funny!)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors duration-200 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Affiliate Link
            </label>
            <input
              type="url"
              value={formData.affiliateLink}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliateLink: e.target.value }))}
              className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="weird, tech, gift, wtf"
              className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm font-medium text-black">
              Featured (Daily WTF)
            </label>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 border border-black/20 bg-white hover:bg-gray-50 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending}
              className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              {createProduct.isPending ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}