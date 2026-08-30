import type { Memory } from "@/types/memory";

export function calculateComplicityScore(
  memories: Memory[],
  totalChallenges: number
): number {
  if (totalChallenges <= 0) return 0;

  const completedCount = memories.length;

  const completionScore =
    (completedCount / totalChallenges) * 50;

  if (memories.length === 0) {
    return Math.round(completionScore);
  }

  const totalEmotion = memories.reduce(
    (sum, memory) => sum + memory.emotionRating,
    0
  );

  const averageEmotion =
    totalEmotion / memories.length;

  const emotionScore = averageEmotion * 10;

  return Math.min(
    100,
    Math.round(completionScore + emotionScore)
  );
}