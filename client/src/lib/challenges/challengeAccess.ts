import type { Challenge } from "@/types/challenge";

export type ChallengeAccess = "free" | "premium";

/**
 * Temporary compatibility rule for the static catalog.
 * Once challenges come from the API/CMS, `access` should be explicit data
 * and this fallback should be removed.
 */
export function getChallengeAccess(
  challenge: Pick<Challenge, "id" | "access">,
): ChallengeAccess {
  return challenge.access ?? (challenge.id <= 10 ? "free" : "premium");
}

export function isFreeChallenge(
  challenge: Pick<Challenge, "id" | "access">,
): boolean {
  return getChallengeAccess(challenge) === "free";
}

export function isPremiumChallenge(
  challenge: Pick<Challenge, "id" | "access">,
): boolean {
  return getChallengeAccess(challenge) === "premium";
}