import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: check if user already started a quiz
export const getByUserAndQuiz = query({
  args: { userId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userQuizTrackers")
      .withIndex("by_user_and_quiz", (q) =>
        q.eq("userId", args.userId).eq("quizId", args.quizId),
      )
      .first();
  },
});

// Mutation: start a new quiz
export const startQuiz = mutation({
  args: { userId: v.string(), quizId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userQuizTrackers")
      .withIndex("by_user_and_quiz", (q) =>
        q.eq("userId", args.userId).eq("quizId", args.quizId),
      )
      .first();

    if (existing) return existing;

    return await ctx.db.insert("userQuizTrackers", {
      userId: args.userId,
      quizId: args.quizId,
      answers: [],
      startedAt: Date.now(),
    });
  },
});

export const setAnswer = mutation({
  args: {
    trackerId: v.id("userQuizTrackers"),
    index: v.number(),
    answer: v.string(),
  },
  handler: async (ctx, { trackerId, index, answer }) => {
    const doc = await ctx.db.get(trackerId);
    if (!doc) return;

    const answers = [...doc.answers];
    answers[index] = answer;

    await ctx.db.patch(trackerId, { answers });
  },
});

export const completeQuiz = mutation({
  args: {
    trackerId: v.id("userQuizTrackers"),
    endedAt: v.number(),
    score: v.number(),
  },
  handler: async (ctx, { trackerId, endedAt, score }) => {
    await ctx.db.patch(trackerId, { endedAt, score });
  },
});
