import type { AppState } from "@/types/app";
import type { Memory, MemoryPhoto } from "@/types/memory";
import type { Profile } from "@/types/profile";
import type { Subscription } from "@/types/subscription";
import { createId } from "@/lib/ids/createId";

const STORAGE_KEY = "memora-app-state";

const DEFAULT_STATE: AppState = {
  profile: null,
  memories: [],
  onboardingDone: false,
  subscription: { plan: "free", status: "active" },
};

function normalizeProfile(value: unknown): Profile | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as {
    coupleName?: unknown;
    name?: unknown;
    partnerName?: unknown;
    startDate?: unknown;
    avatar?: unknown;
  };

  const coupleName =
    typeof raw.coupleName === "string" && raw.coupleName.trim()
      ? raw.coupleName.trim()
      : typeof raw.name === "string" && raw.name.trim()
        ? raw.partnerName
          ? `${raw.name.trim()} & ${String(raw.partnerName).trim()}`
          : raw.name.trim()
        : "";

  if (!coupleName) return null;

  const profile: Profile = { coupleName };
  if (typeof raw.startDate === "string" && raw.startDate) profile.startDate = raw.startDate;
  if (typeof raw.avatar === "string" && raw.avatar) profile.avatar = raw.avatar;
  return profile;
}

function normalizePhoto(photo: MemoryPhoto | string): MemoryPhoto {
  if (typeof photo === "string") return { id: createId(), url: photo };

  const normalized: MemoryPhoto = { id: photo.id || createId(), url: photo.url };
  if (photo.width !== undefined) normalized.width = photo.width;
  if (photo.height !== undefined) normalized.height = photo.height;
  if (photo.mimeType !== undefined) normalized.mimeType = photo.mimeType;
  if (photo.sizeBytes !== undefined) normalized.sizeBytes = photo.sizeBytes;
  if (photo.storageKey !== undefined) normalized.storageKey = photo.storageKey;
  return normalized;
}

function normalizeMemory(memory: Partial<Memory> & { challengeId: number }): Memory {
  const normalized: Memory = {
    id: memory.id || createId(),
    challengeId: memory.challengeId,
    date: memory.date || new Date().toISOString(),
    emotionRating: Math.min(5, Math.max(1, memory.emotionRating ?? 3)),
    photos: Array.isArray(memory.photos) ? memory.photos.map(normalizePhoto) : [],
    completedAt: memory.completedAt || new Date().toISOString(),
  };

  if (typeof memory.location === "string" && memory.location.trim()) normalized.location = memory.location.trim();
  if (typeof memory.description === "string" && memory.description.trim()) normalized.description = memory.description.trim();
  return normalized;
}

function normalizeMemories(value: unknown): Memory[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (memory): memory is Partial<Memory> & { challengeId: number } =>
        !!memory &&
        typeof memory === "object" &&
        typeof (memory as { challengeId?: unknown }).challengeId === "number",
    )
    .map(normalizeMemory);
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const parsed = JSON.parse(stored) as Partial<AppState>;
    const state: AppState = {
      profile: normalizeProfile(parsed.profile),
      memories: normalizeMemories(parsed.memories),
      onboardingDone: parsed.onboardingDone === true,
      subscription: parsed.subscription ?? DEFAULT_STATE.subscription,
    };

    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;

  try {
    const lightweight = {
      ...state,
      memories: state.memories.map((memory) => ({
        ...memory,
        photos: memory.photos.map((memoryPhoto) => {
          const { id, url, width, height, mimeType } = memoryPhoto;
          const photo: MemoryPhoto = { id, url };
          if (width !== undefined) photo.width = width;
          if (height !== undefined) photo.height = height;
          if (mimeType !== undefined) photo.mimeType = mimeType;
          if (memoryPhoto.sizeBytes !== undefined) photo.sizeBytes = memoryPhoto.sizeBytes;
          if (memoryPhoto.storageKey !== undefined) photo.storageKey = memoryPhoto.storageKey;
          return photo;
        }),
      })),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
  } catch (error) {
    console.error(
      "Unable to persist MEMORA state. Production media must use object storage.",
      error,
    );
  }
}

export function clearAppState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
