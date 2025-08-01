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
      orderBy: { createdAt: 'desc' },
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

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      imageUrl: z.string().url(),
      affiliateLink: z.string().url(),
      tags: z.array(z.string()),
      isFeatured: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wtfProduct.create({
        data: input,
      });
    }),
});
