import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const wtfProductRouter = createTRPCRouter({
  getRandom: publicProcedure.query(async ({ ctx }) => {
    // Get total count first
    const count = await ctx.db.wtfProduct.count();
    if (count === 0) return null;

    // Get random product
    const skip = Math.floor(Math.random() * count);
    const product = await ctx.db.wtfProduct.findFirst({
      skip,
    });

    return product;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.wtfProduct.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getDailyFeatured: publicProcedure.query(async ({ ctx }) => {
    // Get today's featured product (or most recent featured)
    const featured = await ctx.db.wtfProduct.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    });

    return featured;
  }),

  getByTags: publicProcedure
    .input(z.object({ tags: z.array(z.string()).optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.tags || input.tags.length === 0) {
        return ctx.db.wtfProduct.findMany({
          orderBy: { createdAt: "desc" },
          take: 20,
        });
      }

      return ctx.db.wtfProduct.findMany({
        where: {
          tags: {
            hasSome: input.tags,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }),

  getShuffled: publicProcedure
    .input(
      z.object({
        count: z.number().min(1).max(50).default(12),
        category: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = {};

      // Apply category filter if provided
      if (input.category) {
        whereClause = {
          tags: {
            hasSome: [input.category],
          },
        };
      }

      // Get all products matching the filter
      const allProducts = await ctx.db.wtfProduct.findMany({
        where: whereClause,
      });

      // Shuffle the results server-side
      const shuffled = allProducts.sort(() => Math.random() - 0.5);

      // Return the requested count
      return shuffled.slice(0, input.count);
    }),

  getInfiniteScroll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
        category: z.string().optional(),
        seed: z.number().optional(), // For consistent shuffling
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = {};

      // Apply category filter if provided
      if (input.category) {
        whereClause = {
          tags: {
            hasSome: [input.category],
          },
        };
      }

      // Get all products matching the filter
      const allProducts = await ctx.db.wtfProduct.findMany({
        where: whereClause,
      });

      // FIXED: Only shuffle once when offset is 0, then maintain order
      let orderedProducts;
      if (input.offset === 0) {
        // Use seed for consistent shuffling on initial load
        const seed = input.seed ?? Date.now();
        orderedProducts = allProducts.sort((a, b) => {
          // Create deterministic hash for each product using seed
          const hashA = Math.sin((seed + a.id.charCodeAt(0)) * 10000);
          const hashB = Math.sin((seed + b.id.charCodeAt(0)) * 10000);
          return hashA - hashB;
        });
      } else {
        // For subsequent requests, maintain the same order by using the same seed
        // This ensures consistency across pagination
        const seed = input.seed ?? Date.now();
        orderedProducts = allProducts.sort((a, b) => {
          const hashA = Math.sin((seed + a.id.charCodeAt(0)) * 10000);
          const hashB = Math.sin((seed + b.id.charCodeAt(0)) * 10000);
          return hashA - hashB;
        });
      }

      // Get the slice based on offset and limit
      const products = orderedProducts.slice(
        input.offset,
        input.offset + input.limit,
      );
      const hasMore = orderedProducts.length > input.offset + input.limit;

      return {
        products,
        hasMore,
        total: orderedProducts.length,
        nextOffset: hasMore ? input.offset + input.limit : null,
        seed: input.seed ?? Date.now(), // Keep the same seed for consistency
      };
    }),

  getAllTags: publicProcedure.query(async ({ ctx }) => {
    // Get all products with their tags
    const products = await ctx.db.wtfProduct.findMany({
      select: {
        tags: true,
      },
    });

    // Extract all unique tags
    const allTags = products.flatMap((product) => product.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    return uniqueTags;
  }),

  getRecommendations: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        limit: z.number().min(1).max(10).default(4),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the source product
      const sourceProduct = await ctx.db.wtfProduct.findUnique({
        where: { id: input.productId },
        select: { tags: true },
      });

      if (!sourceProduct || sourceProduct.tags.length === 0) {
        return [];
      }

      // Find products with overlapping tags (excluding the source product)
      const candidates = await ctx.db.wtfProduct.findMany({
        where: {
          id: { not: input.productId },
          tags: {
            hasSome: sourceProduct.tags,
          },
        },
      });

      // Score products by number of shared tags and sort
      const scoredProducts = candidates
        .map((product) => {
          const sharedTags = product.tags.filter((tag) =>
            sourceProduct.tags.includes(tag),
          );
          return {
            ...product,
            score: sharedTags.length,
            sharedTags,
          };
        })
        .sort((a, b) => {
          // Sort by score (descending), then by creation date (newest first)
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .slice(0, input.limit);

      return scoredProducts;
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        category: z.string().optional(),
        sortBy: z.enum(["relevance", "newest", "oldest", "title"]).default("relevance"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, limit, offset, category, sortBy } = input;
      
      // Build search conditions
      const searchConditions = {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            tags: {
              hasSome: [query],
            },
          },
        ],
        ...(category && {
          tags: {
            has: category,
          },
        }),
      };

      // Build order by clause
      let orderBy: { createdAt?: "desc" | "asc"; title?: "asc" };
      switch (sortBy) {
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "title":
          orderBy = { title: "asc" };
          break;
        case "relevance":
        default:
          // For relevance, we'll sort by title match first, then description match
          orderBy = { createdAt: "desc" }; // Fallback to newest for now
          break;
      }

      const [products, totalCount] = await Promise.all([
        ctx.db.wtfProduct.findMany({
          where: searchConditions,
          orderBy,
          take: limit,
          skip: offset,
        }),
        ctx.db.wtfProduct.count({
          where: searchConditions,
        }),
      ]);

      // Calculate relevance score for sorting when sortBy is "relevance"
      let scoredProducts: (typeof products[0] & { relevanceScore?: number })[] = products;
      if (sortBy === "relevance") {
        const productsWithScore = products
          .map((product) => {
            let score = 0;
            const lowerQuery = query.toLowerCase();
            const lowerTitle = product.title.toLowerCase();
            const lowerDescription = product.description.toLowerCase();
            
            // Title exact match gets highest score
            if (lowerTitle === lowerQuery) score += 100;
            // Title starts with query gets high score
            else if (lowerTitle.startsWith(lowerQuery)) score += 50;
            // Title contains query gets medium score
            else if (lowerTitle.includes(lowerQuery)) score += 25;
            
            // Description contains query gets lower score
            if (lowerDescription.includes(lowerQuery)) score += 10;
            
            // Tag exact match gets high score
            if (product.tags.some(tag => tag.toLowerCase() === lowerQuery)) score += 75;
            // Tag contains query gets medium score
            else if (product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 15;
            
            return { ...product, relevanceScore: score };
          })
          .sort((a, b) => {
            if (b.relevanceScore !== a.relevanceScore) {
              return b.relevanceScore - a.relevanceScore;
            }
            // If same relevance score, sort by newest
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        scoredProducts = productsWithScore;
      }

      return {
        products: scoredProducts,
        totalCount,
        hasMore: offset + limit < totalCount,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().url(),
        affiliateLink: z.string().url(),
        tags: z.array(z.string()),
        isFeatured: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wtfProduct.create({
        data: {
          ...input,
          platformType: "Unknown", // Add required platformType field
        },
      });
    }),
});
