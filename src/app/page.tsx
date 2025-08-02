import { WtfProductCard } from "./_components/wtf-product-card";
import { DailyWtf } from "./_components/daily-wtf";
import { ProductGrid } from "./_components/product-grid";
import { FloatingShuffleButton } from "./_components/floating-shuffle-button";
import { FloatingBookmarksButton } from "./_components/floating-bookmarks-button";
import { api, HydrateClient } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  // Prefetch data for better performance
  void api.wtfProduct.getRandom.prefetch();
  void api.wtfProduct.getDailyFeatured.prefetch();

  // https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISL73txkT8DSGuIZABy60wbKmgjdrXUEOlYeVk
  // https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISGbMdLPYpCiVBSwUI2j64O5XhDs7A3qRN0TJc
  // https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISA0uD7OoLcmfuYs9tiIhdwOS40NGWTxaX5C8B
  const images = [
    "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISvJ9kKo5pKbxuMe1UwW3IDoHdl4fPitZNhg5v",
    "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISTa5oFi05teDvw8XUI6ZbJPgxi9proFH7aR01",
    "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISxlMlkhCH4uEpRjthBxNAYGX7kz6TPengV1WQ",
  ];

  const imagerender = images[Math.floor(Math.random() * images.length)];

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            {/* Product Image */}
            <div className="mb-12 flex justify-center">
              <div className="mx-auto max-w-2/12">
                {/* <div className="text-6xl md:text-7xl">🌱</div> */}
                <Image
                  src={imagerender ?? ""}
                  alt="WTF Product"
                  width={4}
                  height={4}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl leading-tight font-bold text-black md:text-6xl">
              You didn&apos;t know you needed this.
              <br />
              You still don&apos;t.
              <br />
              But you&apos;re gonna click it.
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 md:text-xl">
              Daily drops of the most WTF-worthy products humans have ever
              created.
            </p>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <a
                href="#products"
                className="inline-block rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-gray-800 md:text-xl"
              >
                Show Me Something Weird
              </a>
              <br />
              <a
                href="#safety"
                className="text-gray-600 underline transition-colors duration-300 hover:text-black hover:no-underline"
              >
                I&apos;m scared. Take me to safety.
              </a>
            </div>
          </div>

          {/* Daily WTF Section */}
          {/* <div className="mx-auto mb-20 max-w-lg">
            <DailyWtf />
          </div> */}

          {/* All WTF Products Section */}
          <div id="products" className="mb-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                All WTF Products
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Discover the weirdest finds from around the world
              </p>
            </div>
            <ProductGrid />
          </div>

          {/* Floating Action Buttons */}
          <FloatingShuffleButton />
          <FloatingBookmarksButton />

          {/* Safety Section */}
          <div id="safety" className="mx-auto mb-20 max-w-2xl">
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-black md:text-3xl">
                Safe Zone
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Don&apos;t worry! These products are real but harmless. We
                promise no actual WTF moments will hurt you.
              </p>
              <div className="mb-8 rounded-xl border border-black/5 bg-gray-50 p-6">
                <div className="space-y-2 text-gray-700">
                  <p>✓ All products are real</p>
                  <p>✓ No dangerous items</p>
                  <p>✓ Just hilariously weird stuff</p>
                  <p>✓ Safe for your sanity (mostly)</p>
                </div>
              </div>
              <a
                href="#products"
                className="inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
              >
                OK, I&apos;m ready for weird stuff!
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 border-t border-black/10 pt-12 pb-8">
            <div className="text-center">
              {/* Logo/Brand */}
              <div className="mb-6 flex items-center justify-center gap-2">
                <div className="text-2xl">🌱</div>
                <h3 className="text-xl font-bold text-black">
                  WTF EARTH FINDS
                </h3>
              </div>

              {/* Copyright */}
              <p className="mb-6 text-sm text-gray-600">
                © 2025 WTF Earth Finds. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="mb-8 flex justify-center gap-4">
                <a
                  href="https://www.facebook.com/wtfearthfinds"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@WTFEarthFinds"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Footer Links */}
              <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  Affiliate Disclosure
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-black"
                >
                  DMCA Policy
                </a>
              </div>

              {/* Affiliate Disclosure */}
              <div className="mx-auto max-w-4xl text-xs leading-relaxed text-gray-500">
                <p className="mb-2">
                  WTF Earth Finds is reader supported, some products displayed
                  may earn us a commission if you purchase through our links.
                  WTF Earth Finds is a participant in the Amazon Services LLC
                  Associates Program.
                  <a
                    href="#"
                    className="text-gray-600 underline transition-colors hover:text-black"
                  >
                    Learn more about how our site works.
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </HydrateClient>
  );
}
