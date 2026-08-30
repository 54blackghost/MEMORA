export function calculateChallengeProgress(
  completed: number,
  total: number
): number {
  if (total <= 0) return 0;

  return Math.min(
    100,
    Math.round((completed / total) * 100)
  );
}