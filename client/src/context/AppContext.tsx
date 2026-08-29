import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CompletedChallenge {
  challengeId: number;
  date: string;
  location: string;
  description: string;
  emotionRating: number;
  photos: string[]; // base64
  completedAt: string;
}

export interface UserProfile {
  coupleName: string;
  startDate?: string;
}

interface AppState {
  profile: UserProfile | null;
  completedChallenges: CompletedChallenge[];
  onboardingDone: boolean;
}

interface AppContextType extends AppState {
  setProfile: (profile: UserProfile) => void;
  completeChallenge: (challenge: CompletedChallenge) => void;
  setOnboardingDone: () => void;
  getCompletedChallenge: (id: number) => CompletedChallenge | undefined;
  isCompleted: (id: number) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "createur-souvenirs-data";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { profile: null, completedChallenges: [], onboardingDone: false };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setProfile = (profile: UserProfile) => {
    setState((s) => ({ ...s, profile }));
  };

  const completeChallenge = (challenge: CompletedChallenge) => {
    setState((s) => ({
      ...s,
      completedChallenges: [
        ...s.completedChallenges.filter((c) => c.challengeId !== challenge.challengeId),
        challenge,
      ],
    }));
  };

  const setOnboardingDone = () => {
    setState((s) => ({ ...s, onboardingDone: true }));
  };

  const getCompletedChallenge = (id: number) =>
    state.completedChallenges.find((c) => c.challengeId === id);

  const isCompleted = (id: number) =>
    state.completedChallenges.some((c) => c.challengeId === id);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfile,
        completeChallenge,
        setOnboardingDone,
        getCompletedChallenge,
        isCompleted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
