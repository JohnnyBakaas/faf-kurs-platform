import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  userQuizTrackers: defineTable({
    userId: v.string(),
    quizId: v.string(),
    answers: v.array(v.string()),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    score: v.optional(v.number()),
  }).index("by_user_and_quiz", ["userId", "quizId"]),
});
