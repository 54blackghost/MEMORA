import type { Challenge } from "@/types/challenge";

interface DailyChallengeOptions {
  challenges: Challenge[];
  completedIds: Set<number>;
  date?: Date;
}

export function getDailyChallenge({
  challenges,
  completedIds,
  date = new Date(),
}: DailyChallengeOptions): Challenge | undefined {
  const available = challenges.filter(
    (challenge) =>
      challenge.isActive &&
      !completedIds.has(challenge.id)
  );

  if (available.length === 0) {
    return undefined;
  }

  const dayOfYear = Math.floor(
    (date.getTime() -
      new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );

  return available[dayOfYear % available.length];
}