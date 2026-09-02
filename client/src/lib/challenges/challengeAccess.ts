import type { Challenge } from "@/data/challenges";

export type ChallengeAccess = "free" | "premium";

/**
 * MEMORA currently keeps challenge content in a static catalog.
 *
 * Product rule:
 * - Challenges 1–10 are free.
 * - Challenges 11–101 are premium.
 *
 * `access` remains optional for backwards compatibility and can later
 * be explicitly configured per challenge from the backend/CMS.
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
