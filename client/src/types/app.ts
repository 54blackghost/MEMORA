import type { Memory } from "./memory";
import type { Profile } from "./profile";
import type { Subscription } from "./subscription";

export interface AppState {
  profile: Profile | null;
  memories: Memory[];
  onboardingDone: boolean;
  subscription: Subscription;
}