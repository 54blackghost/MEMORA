import { Memory } from "@/types/memory";

export function createMemoryId(): string {
  return crypto.randomUUID();
}


const memory: Memory = {
  id: createMemoryId(),
  challengeId: challenge.id,
  date,
  location,
  description,
  emotionRating,
  photos,
  completedAt: new Date().toISOString(),
};