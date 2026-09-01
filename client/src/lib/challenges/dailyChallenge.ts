import type { Challenge } from "@/data/challenges";

interface DailyChallengeOptions {
  challenges: Challenge[];
  completedIds: Set<number>;
  canAccess: (challenge: Challenge) => boolean;
  date?: Date;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.floor(
    (current.getTime() - start.getTime()) / 86_400_000
  );
}

export function getDailyChallenge({
  challenges,
  completedIds,
  canAccess,
  date = new Date(),
}: DailyChallengeOptions): Challenge | undefined {
  const available = challenges.filter(
    (challenge) =>
      challenge.isActive &&
      !completedIds.has(challenge.id) &&
      canAccess(challenge)
  );

  if (available.length === 0) {
    return challenges.find(
      (challenge) => challenge.isActive && canAccess(challenge)
    );
  }

  return available[getDayOfYear(date) % available.length];
}
