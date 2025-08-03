"use client";

import { useState } from "react";
import { Share2, Copy, X } from "lucide-react";
import { useSuccessToast, useErrorToast } from "@/components/ui/toast";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
}

interface ShareOption {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const shareData = {
    title,
    text: text ?? title,
    url,
  };

  const handleNativeShare = async () => {
    if (isSharing) return; // Prevent multiple simultaneous shares
    
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share(shareData);
      } catch (error) {
        const errorName = (error as Error).name;
        if (errorName !== "AbortError") {
          console.error("Error sharing:", error);
          if (errorName === "InvalidStateError") {
            errorToast("Please wait before sharing again");
          } else {
            setShowModal(true);
          }
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      successToast("Link copied to clipboard!");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to copy:", error);
      errorToast("Failed to copy link");
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: "Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(url)}`,
      color: "hover:bg-black",
    },
    {
      name: "Facebook",
      icon: "f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-600",
    },
    {
      name: "LinkedIn",
      icon: "in",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-700",
    },
    {
      name: "WhatsApp",
      icon: "📱",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${url}`)}`,
      color: "hover:bg-green-600",
    },
  ];

  return (
    <>
      <button
        onClick={handleNativeShare}
        disabled={isSharing}
        className={`rounded-lg bg-gray-600/90 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
        title={isSharing ? "Sharing..." : "Share"}
      >
        <Share2 className={`h-4 w-4 ${isSharing ? 'animate-pulse' : ''}`} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-lg font-semibold text-gray-900">Share this</h3>

            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center transition-colors ${option.color} hover:text-white`}
                  onClick={() => setShowModal(false)}
                >
                  <span className="mr-2 text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.name}</span>
                </a>
              ))}
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}