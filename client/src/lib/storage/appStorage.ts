import type { AppState } from "@/types/app";
import type { Memory, MemoryPhoto } from "@/types/memory";

const STORAGE_KEY = "memora-app-state";

const DEFAULT_STATE: AppState = {
  profile: null,
  memories: [],
  onboardingDone: false,
  subscription: { plan: "free", status: "active" },
};

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizePhoto(photo: MemoryPhoto | string): MemoryPhoto {
  if (typeof photo === "string") return { id: createId(), url: photo };
  return { ...photo, id: photo.id || createId() };
}

function normalizeMemory(memory: Partial<Memory> & { challengeId: number }): Memory {
  return {
    id: memory.id || createId(),
    challengeId: memory.challengeId,
    date: memory.date || new Date().toISOString(),
    location: memory.location,
    description: memory.description,
    emotionRating: Math.min(5, Math.max(1, memory.emotionRating ?? 3)),
    photos: Array.isArray(memory.photos) ? memory.photos.map(normalizePhoto) : [],
    completedAt: memory.completedAt || new Date().toISOString(),
  };
}

function normalizeMemories(value: unknown): Memory[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((memory): memory is Partial<Memory> & { challengeId: number } =>
      !!memory && typeof memory === "object" && typeof (memory as { challengeId?: unknown }).challengeId === "number",
    )
    .map(normalizeMemory);
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const parsed = JSON.parse(stored) as Partial<AppState>;

    return {
      ...DEFAULT_STATE,
      ...parsed,
      memories: normalizeMemories(parsed.memories),
      subscription: parsed.subscription ?? DEFAULT_STATE.subscription,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to persist MEMORA state", error);
  }
}

export function clearAppState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
