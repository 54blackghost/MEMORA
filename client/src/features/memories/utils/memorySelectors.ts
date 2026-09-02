import type { Memory } from "@/types/memory";

export function sortMemoriesByCompletedAt(memories: Memory[], direction: "asc" | "desc" = "desc") {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...memories].sort(
    (a, b) => multiplier * (new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()),
  );
}

export function getMemoriesForChallenge(memories: Memory[], challengeId: number) {
  return memories.filter((memory) => memory.challengeId === challengeId);
}

export function getLatestMemoryForChallenge(memories: Memory[], challengeId: number) {
  return sortMemoriesByCompletedAt(getMemoriesForChallenge(memories, challengeId))[0];
}

export function hasMemoryForChallenge(memories: Memory[], challengeId: number) {
  return memories.some((memory) => memory.challengeId === challengeId);
}
