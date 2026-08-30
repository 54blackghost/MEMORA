import { plans } from "./plans";
import type {
  Feature,
  PlanId,
  Subscription,
} from "@/types/subscription";


/**
 * The default plan to use if no plan is specified.
 */
const DEFAULT_PLAN: PlanId = "free";

/**
 * Retrieves the plan information based on its ID.
 * @param planId The ID of the plan to retrieve.
 * @returns The plan information or the default plan if not found.
 */
export function getPlan(planId?: PlanId) {
  return plans.find((plan) => plan.id === planId) ?? plans[0];
}

/**
 * Checks if a feature is available in the specified subscription.
 * @param feature The feature to check.
 * @param subscription The subscription to check against.
 * @returns True if the feature is available, false otherwise.
 */
export function can(
  feature: Feature,
  subscription?: Subscription
): boolean {
  const plan = getPlan(subscription?.plan ?? DEFAULT_PLAN);

  return plan.features.includes(feature);
}


/**
 * Retrieves the limit value for a specific limit type in the given subscription.
 * @param limit The limit type to retrieve.
 * @param subscription The subscription to check against.
 * @returns The limit value or the default limit if not found.
 */
export function getLimit<
  K extends keyof ReturnType<typeof getPlan>["limits"]
>(
  limit: K,
  subscription?: Subscription
) {
  const plan = getPlan(subscription?.plan ?? DEFAULT_PLAN);

  return plan.limits[limit];
}