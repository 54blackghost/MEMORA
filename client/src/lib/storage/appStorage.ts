import type { AppState } from "@/types/app";

const STORAGE_KEY = "memora-app-state";

const DEFAULT_STATE: AppState = {
  profile: null,
  memories: [],
  onboardingDone: false,
  subscription: {
    plan: "free",
    status: "active",
  },
};

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(stored) as Partial<AppState>;

    return {
      ...DEFAULT_STATE,
      ...parsed,
      memories: parsed.memories ?? [],
      subscription:
        parsed.subscription ?? DEFAULT_STATE.subscription,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch (error) {
    console.error(
      "Unable to persist MEMORA state",
      error
    );
  }
}

export function clearAppState(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}