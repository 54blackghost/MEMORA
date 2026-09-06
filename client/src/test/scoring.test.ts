import { describe, expect, it } from "vitest";
import { calculateComplicityScore } from "@/lib/scoring/complicityScore";
import type { Memory } from "@/types/memory";

const memory = (id: string, challengeId: number, emotionRating = 5): Memory => ({
  id, challengeId, date: "2026-01-01", emotionRating, photos: [], completedAt: "2026-01-01T00:00:00.000Z",
});

describe("complicity score", () => {
  it("does not count multiple memories for one challenge as multiple completed challenges", () => {
    expect(calculateComplicityScore([memory("1", 1), memory("2", 1)], 10)).toBe(55);
  });
});