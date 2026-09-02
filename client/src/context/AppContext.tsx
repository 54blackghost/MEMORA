import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AppState } from "@/types/app";
import type { Memory } from "@/types/memory";
import type { Profile } from "@/types/profile";
import type { Subscription } from "@/types/subscription";

import {
  loadAppState,
  saveAppState,
} from "@/lib/storage/appStorage";

interface AppContextValue extends AppState {
  setProfile: (profile: Profile) => void;
  setSubscription: (subscription: Subscription) => void;
  addMemory: (memory: Memory) => void;
  updateMemory: (
    memoryId: string,
    updates: Partial<Memory>,
  ) => void;
  removeMemory: (memoryId: string) => void;
  setOnboardingDone: (done: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(
  undefined,
);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadAppState);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,

      setProfile: (profile) => {
        setState((current) => ({ ...current, profile }));
      },

      setSubscription: (subscription) => {
        setState((current) => ({ ...current, subscription }));
      },

      addMemory: (memory) => {
        setState((current) => ({
          ...current,
          memories: [...current.memories, memory],
        }));
      },

      updateMemory: (memoryId, updates) => {
        setState((current) => ({
          ...current,
          memories: current.memories.map((memory) =>
            memory.id === memoryId
              ? { ...memory, ...updates }
              : memory,
          ),
        }));
      },

      removeMemory: (memoryId) => {
        setState((current) => ({
          ...current,
          memories: current.memories.filter(
            (memory) => memory.id !== memoryId,
          ),
        }));
      },

      setOnboardingDone: (done) => {
        setState((current) => ({
          ...current,
          onboardingDone: done,
        }));
      },
    }),
    [state],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
