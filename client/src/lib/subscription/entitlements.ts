import { plans } from "./plans";
import type { Feature, PlanId, Subscription, SubscriptionStatus } from "@/types/subscription";

const DEFAULT_PLAN: PlanId = "free";
const ACTIVE_STATUSES: ReadonlySet<SubscriptionStatus> = new Set(["active", "trialing"]);

export function isSubscriptionActive(subscription?: Subscription): boolean {
  if (!subscription) return true; // no subscription object means Free demo access
  return ACTIVE_STATUSES.has(subscription.status);
}

export function getPlan(planId?: PlanId) {
  return plans.find((plan) => plan.id === planId) ?? plans.find((plan) => plan.id === DEFAULT_PLAN)!;
}

export function can(feature: Feature, subscription?: Subscription): boolean {
  if (!isSubscriptionActive(subscription)) return false;
  return getPlan(subscription?.plan ?? DEFAULT_PLAN).features.includes(feature);
}

export function getLimit<K extends keyof ReturnType<typeof getPlan>["limits"]>(limit: K, subscription?: Subscription) {
  if (!isSubscriptionActive(subscription)) return getPlan(DEFAULT_PLAN).limits[limit];
  return getPlan(subscription?.plan ?? DEFAULT_PLAN).limits[limit];
}
