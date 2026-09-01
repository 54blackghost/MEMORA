import type { Memory } from "@/types/memory";

export function calculateComplicityScore(
  memories: Memory[],
  totalChallenges: number
): number {
  if (totalChallenges <= 0 || memories.length === 0) {
    return 0;
  }

  const completionScore =
    Math.min(memories.length / totalChallenges, 1) * 50;

  const averageEmotion =
    memories.reduce((sum, memory) => sum + memory.emotionRating, 0) /
    memories.length;

  const emotionScore = Math.min(averageEmotion / 5, 1) * 50;

  return Math.min(
    100,
    Math.round(completionScore + emotionScore)
  );
}
