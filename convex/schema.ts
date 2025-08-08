import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  nodes: defineTable({
    userId: v.string(),
    nodeId: v.string(),
    type: v.union(
      v.literal("idea"),
      v.literal("niche"),
      v.literal("generate"),
      v.literal("projectPlan"),
    ),
    data: v.any(),
    updatedAt: v.number(),
    createdAt: v.number(),
  }).index("by_user_node", ["userId", "nodeId"]).index("by_user_type", ["userId", "type"]).index("by_nodeId", ["nodeId"]),
  // Keep compatibility with existing example query in src/app/page.tsx
  messages: defineTable({
    author: v.string(),
    body: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }).index("by_author", ["author"]),
});


