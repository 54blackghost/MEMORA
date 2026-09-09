import { describe, expect, it } from "vitest";
import { getDailyChallenge } from "@/lib/challenges/dailyChallenge";
import type { Challenge } from "@/types/challenge";

const challenges: Challenge[] = [
  { id: 1, title: "A", category: "romantique", emoji: "A", access: "free", isActive: true },
  { id: 2, title: "B", category: "aventure", emoji: "B", access: "free", isActive: true },
  { id: 3, title: "C", category: "créativité", emoji: "C", access: "premium", isActive: true },
];

describe("daily challenge", () => {
  it("is deterministic for the same date", () => {
    const date = new Date("2026-09-06T12:00:00.000Z");
    const a = getDailyChallenge({ challenges, completedIds: new Set(), canAccess: () => true, date });
    const b = getDailyChallenge({ challenges, completedIds: new Set(), canAccess: () => true, date });
    expect(a?.id).toBe(b?.id);
  });

  it("ignores inactive challenges", () => {
    const list = challenges.map((item) => ({ ...item, isActive: item.id !== 1 }));
    const result = getDailyChallenge({ challenges: list, completedIds: new Set(), canAccess: () => true, date: new Date("2026-09-06") });
    expect(result?.id).not.toBe(1);
  });

  it("does not return a completed challenge when nothing is available", () => {
    const result = getDailyChallenge({
      challenges,
      completedIds: new Set([1, 2, 3]),
      canAccess: () => true,
    });
    expect(result).toBeUndefined();
  });
});
