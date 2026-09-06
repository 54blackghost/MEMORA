import type { Memory } from "@/types/memory";

export function sortMemoriesByCompletedAt(memories: Memory[], direction: "asc" | "desc" = "desc") {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...memories].sort((a, b) => {
    const aTime = new Date(a.completedAt).getTime();
    const bTime = new Date(b.completedAt).getTime();
    return (aTime - bTime) * multiplier;
  });
}

export function getMemoryCoverPhoto(memory: Memory) {
  return memory.photos.find((photo) => Boolean(photo.url));
}

export function getUniqueChallengeIds(memories: Memory[]) {
  return new Set(memories.map((memory) => memory.challengeId));
}
