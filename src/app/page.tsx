import { WtfProductCard } from "./_components/wtf-product-card";
import { DailyWtf } from "./_components/daily-wtf";
import { ProductGrid } from "./_components/product-grid";
import { AdminForm } from "./_components/admin-form";
import { FloatingShuffleButton } from "./_components/floating-shuffle-button";
import { FloatingBookmarksButton } from "./_components/floating-bookmarks-button";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // Prefetch data for better performance
  void api.wtfProduct.getRandom.prefetch();
  void api.wtfProduct.getDailyFeatured.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white p-8">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {/* Product Image */}
            <div className="mb-12 flex justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center hover:shadow-md transition-shadow duration-300">
                <div className="text-6xl md:text-7xl">🌱</div>
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              You didn&apos;t know you needed this.<br/>
              You still don&apos;t.<br/>
              But you&apos;re gonna click it.
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Daily drops of the most WTF-worthy products humans have ever created.
            </p>
            
            {/* CTA Buttons */}
            <div className="space-y-4">
              <a href="#products" className="bg-black hover:bg-gray-800 text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-lg transition-colors duration-300 inline-block">
                Show Me Something Weird
              </a>
              <br />
              <a href="#safety" className="text-gray-600 hover:text-black underline hover:no-underline transition-colors duration-300">
                I&apos;m scared. Take me to safety.
              </a>
            </div>
          </div>

          {/* Daily WTF Section */}
          <div className="max-w-lg mx-auto mb-20">
            <DailyWtf />
          </div>

          {/* All WTF Products Section */}
          <div id="products" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">All WTF Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the weirdest finds from around the world</p>
            </div>
            <ProductGrid />
          </div>

          {/* Admin Form */}
          <div className="max-w-lg mx-auto mb-20">
            <AdminForm />
          </div>

          {/* Floating Action Buttons */}
      <FloatingShuffleButton />
      <FloatingBookmarksButton />

          {/* Safety Section */}
          <div id="safety" className="mb-20 max-w-2xl mx-auto">
            <div className="text-center bg-white border border-black/10 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">Safe Zone</h2>
              <p className="text-lg text-gray-600 mb-8">
                Don&apos;t worry! These products are real but harmless. We promise no actual WTF moments will hurt you.
              </p>
              <div className="bg-gray-50 border border-black/5 rounded-xl p-6 mb-8">
                <div className="text-gray-700 space-y-2">
                  <p>✓ All products are real</p>
                  <p>✓ No dangerous items</p>
                  <p>✓ Just hilariously weird stuff</p>
                  <p>✓ Safe for your sanity (mostly)</p>
                </div>
              </div>
              <a href="#products" className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 inline-block">
                OK, I&apos;m ready for weird stuff!
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-20 border-t border-black/10 pt-12 pb-8">
            <p className="text-gray-600 mb-2">
              Made with curiosity for finding the weirdest stuff on Earth
            </p>
            <p className="text-sm text-gray-500">
              Warning: May cause uncontrollable laughter and impulse purchases
            </p>
          </footer>
        </div>
       </main>
     </HydrateClient>
   );
 }
