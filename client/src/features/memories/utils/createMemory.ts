import type { Memory, MemoryPhoto } from "@/types/memory";
import type { MemoryFormValues } from "../schemas/memorySchema";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface CreateMemoryInput {
  challengeId: number;
  values: MemoryFormValues;
  photos: string[];
}

export function createMemory({ challengeId, values, photos }: CreateMemoryInput): Memory {
  const memoryPhotos: MemoryPhoto[] = photos.map((url) => ({ id: createId(), url }));

  return {
    id: createId(),
    challengeId,
    date: values.date,
    location: values.location?.trim() || undefined,
    description: values.description?.trim() || undefined,
    emotionRating: values.emotionRating,
    photos: memoryPhotos,
    completedAt: new Date().toISOString(),
  };
}
