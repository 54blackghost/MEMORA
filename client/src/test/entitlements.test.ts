import { describe, expect, it } from "vitest";
import { can, getLimit, isSubscriptionActive } from "@/lib/subscription/entitlements";

describe("subscription entitlements", () => {
  it("gives Free three photos per memory", () => {
    expect(getLimit("maxPhotosPerMemory", { plan: "free", status: "active" })).toBe(3);
  });

  it("allows basic PDF for Free", () => {
    expect(can("basic_pdf_export", { plan: "free", status: "active" })).toBe(true);
  });

  it("does not grant premium features to canceled subscriptions", () => {
    const subscription = { plan: "premium" as const, status: "canceled" as const };
    expect(isSubscriptionActive(subscription)).toBe(false);
    expect(can("premium_challenges", subscription)).toBe(false);
  });
});