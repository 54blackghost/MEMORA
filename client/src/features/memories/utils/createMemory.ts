import type { Memory, MemoryPhoto } from "@/types/memory";
import type { StoredPhoto } from "@/lib/media/photoStorage";
import type { MemoryFormValues } from "../schemas/memorySchema";
import { createId } from "@/lib/ids/createId";

interface CreateMemoryInput {
  memoryId?: string;
  challengeId: number;
  values: MemoryFormValues;
  photos: StoredPhoto[];
}

export function createMemory({
  memoryId = createId(),
  challengeId,
  values,
  photos,
}: CreateMemoryInput): Memory {
  const memoryPhotos: MemoryPhoto[] = photos.map((photo) => {
    const normalized: MemoryPhoto = {
      id: photo.id || createId(),
      url: photo.url,
    };
    if (photo.width !== undefined) normalized.width = photo.width;
    if (photo.height !== undefined) normalized.height = photo.height;
    if (photo.mimeType !== undefined) normalized.mimeType = photo.mimeType;
    if (photo.sizeBytes !== undefined) normalized.sizeBytes = photo.sizeBytes;
    if (photo.storageKey !== undefined) normalized.storageKey = photo.storageKey;
    return normalized;
  });

  const memory: Memory = {
    id: memoryId,
    challengeId,
    date: values.date,
    emotionRating: values.emotionRating,
    photos: memoryPhotos,
    completedAt: new Date().toISOString(),
  };

  const location = values.location?.trim();
  const description = values.description?.trim();
  if (location) memory.location = location;
  if (description) memory.description = description;

  return memory;
}
