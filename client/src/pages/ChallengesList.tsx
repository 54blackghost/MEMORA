import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Check, Lock, Crown } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import type { Memory } from "@/types/memory";
import { getChallengeAccess } from "@/lib/challenges/challengeAccess";

type Filter = "all" | "done" | "todo";

const ChallengesList = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const { memories, subscription } = useApp();
  const navigate = useNavigate();

  const memoriesByChallenge = useMemo(() => {
    const map = new Map<number, Memory[]>();
    for (const memory of memories) {
      const existing = map.get(memory.challengeId) ?? [];
      existing.push(memory);
      map.set(memory.challengeId, existing);
    }
    return map;
  }, [memories]);

  const filteredChallenges = useMemo(() => {
    switch (filter) {
      case "done":
        return challenges.filter((challenge) =>
          memoriesByChallenge.has(challenge.id),
        );
      case "todo":
        return challenges.filter(
          (challenge) => !memoriesByChallenge.has(challenge.id),
        );
      default:
        return challenges;
    }
  }, [filter, memoriesByChallenge]);

  const hasPremium = subscription.plan !== "free";

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-6 pb-4 pt-8">
        <div className="mb-4">
          <h1 className="text-center font-display text-2xl font-bold">
            101 Défis
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            10 défis gratuits · 91 défis Premium
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {(
            [
              ["all", "Tous"],
              ["todo", "À faire"],
              ["done", "Complétés"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              className="rounded-full font-body text-xs"
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredChallenges.map((challenge) => {
            const challengeMemories =
              memoriesByChallenge.get(challenge.id) ?? [];
            const done = challengeMemories.length > 0;
            const latestMemory = [...challengeMemories].sort(
              (a, b) =>
                new Date(b.completedAt).getTime() -
                new Date(a.completedAt).getTime(),
            )[0];
            const access = getChallengeAccess(challenge);
            const locked = access === "premium" && !hasPremium;

            return (
              <Card
                key={challenge.id}
                className={`border-none shadow-sm transition-all ${
                  locked
                    ? "cursor-pointer opacity-90 hover:shadow-md"
                    : "cursor-pointer hover:shadow-md"
                } ${done ? "bg-primary/5" : ""}`}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="text-2xl">{challenge.emoji}</span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-body text-sm ${
                        done ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {challenge.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                        {challenge.category}
                      </span>
                      {access === "free" ? (
                        <span className="text-[10px] font-medium text-primary">
                          Gratuit
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
                          <Crown className="h-3 w-3" />
                          Premium
                        </span>
                      )}
                      {challengeMemories.length > 1 && (
                        <span className="text-[10px] text-muted-foreground">
                          {challengeMemories.length} souvenirs
                        </span>
                      )}
                    </div>
                  </div>

                  {locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : done ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />
                      {latestMemory && (
                        <div className="flex gap-0.5">
                          {Array.from({
                            length: latestMemory.emotionRating,
                          }).map((_, index) => (
                            <Heart
                              key={index}
                              className="h-3 w-3 fill-primary text-primary"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      #{challenge.id}
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChallengesList;

