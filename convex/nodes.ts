import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertNode = mutation({
  args: {
    nodeId: v.string(),
    type: v.union(
      v.literal("idea"),
      v.literal("niche"),
      v.literal("generate"),
      v.literal("projectPlan"),
    ),
    data: v.any(),
  },
  handler: async (ctx, { nodeId, type, data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const now = Date.now();
    const existing = await ctx.db
      .query("nodes")
      .withIndex("by_user_node", (q) => q.eq("userId", userId).eq("nodeId", nodeId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { data, type, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("nodes", {
      userId,
      nodeId,
      type,
      data,
      updatedAt: now,
      createdAt: now,
    });
  },
});

export const getByNodeId = query({
  args: { nodeId: v.string() },
  handler: async (ctx, { nodeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;
    return await ctx.db
      .query("nodes")
      .withIndex("by_user_node", (q) => q.eq("userId", userId).eq("nodeId", nodeId))
      .unique();
  },
});


