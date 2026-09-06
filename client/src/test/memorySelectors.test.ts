import { describe, expect, it } from "vitest";
import { getUniqueChallengeIds, sortMemoriesByCompletedAt } from "@/features/memories/utils/memorySelectors";
import type { Memory } from "@/types/memory";

const m = (id: string, challengeId: number, at: string): Memory => ({ id, challengeId, date: at, emotionRating: 4, photos: [], completedAt: at });

describe("memory selectors", () => {
  it("sorts without mutating source", () => {
    const input = [m("2", 2, "2026-01-02"), m("1", 1, "2026-01-01")];
    const result = sortMemoriesByCompletedAt(input);
    expect(result.map((x) => x.id)).toEqual(["2", "1"]);
    expect(input.map((x) => x.id)).toEqual(["2", "1"]);
  });

  it("returns unique challenge ids", () => {
    expect(getUniqueChallengeIds([m("1", 1, "2026-01-01"), m("2", 1, "2026-01-02"), m("3", 2, "2026-01-03")]).size).toBe(2);
  });
});
