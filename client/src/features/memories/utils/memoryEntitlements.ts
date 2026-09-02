import type { Memory } from "@/types/memory";
import type { Subscription } from "@/types/subscription";
import { getLimit } from "@/lib/subscription/entitlements";

export function canCreateMemory(memories: Memory[], subscription: Subscription): boolean {
  const limit = getLimit("maxMemories", subscription);
  return limit === null || memories.length < limit;
}

export function getRemainingMemorySlots(memories: Memory[], subscription: Subscription): number | null {
  const limit = getLimit("maxMemories", subscription);
  return limit === null ? null : Math.max(0, limit - memories.length);
}
