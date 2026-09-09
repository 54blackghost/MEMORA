import type { Challenge } from "@/types/challenge";

interface DailyChallengeOptions {
  challenges: Challenge[];
  completedIds: Set<number>;
  canAccess: (challenge: Challenge) => boolean;
  date?: Date;
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function stableHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
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
      canAccess(challenge),
  );

  if (available.length === 0) return undefined;

  return available[stableHash(dateKey(date)) % available.length];
}
