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
        data: input,
      });
    }),
});
