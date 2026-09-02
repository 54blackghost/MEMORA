import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import type { Memory } from "@/types/memory";

type Filter = "all" | "done" | "todo";

const ChallengesList = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const { memories } = useApp();
  const navigate = useNavigate();

  /**
   * Regroupe les souvenirs par challenge.
   *
   * Un challenge peut maintenant avoir plusieurs memories.
   *
   * Exemple :
   * challenge 12
   * ├── memory A
   * ├── memory B
   * └── memory C
   */
  const memoriesByChallenge = useMemo(() => {
    const map = new Map<number, Memory[]>();

    for (const memory of memories) {
      const existing = map.get(memory.challengeId) ?? [];

      existing.push(memory);

      map.set(memory.challengeId, existing);
    }

    return map;
  }, [memories]);

  /**
   * Retourne les souvenirs d'un challenge.
   */
  const getChallengeMemories = (challengeId: number) => {
    return memoriesByChallenge.get(challengeId) ?? [];
  };

  /**
   * Détermine si le challenge a déjà été réalisé.
   *
   * IMPORTANT :
   * On ne vérifie plus "completedChallenge".
   * Un challenge est considéré comme complété dès
   * qu'au moins un Memory existe pour celui-ci.
   */
  const isCompleted = (challengeId: number) => {
    return getChallengeMemories(challengeId).length > 0;
  };

  /**
   * Récupère le dernier souvenir du challenge.
   *
   * Utile pour afficher la note d'émotion dans la liste.
   */
  const getLatestMemory = (challengeId: number) => {
    const challengeMemories = getChallengeMemories(challengeId);

    if (challengeMemories.length === 0) {
      return undefined;
    }

    return [...challengeMemories].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime(),
    )[0];
  };

  /**
   * Filtrage de la liste.
   */
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

      case "all":
      default:
        return challenges;
    }
  }, [filter, memoriesByChallenge]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-6 pt-8 pb-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-center text-2xl font-display font-bold">
            101 Défis
          </h1>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Créez vos souvenirs, un défi à la fois 💕
          </p>
        </div>

        {/* Filters */}
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

        {/* Challenges */}
        <div className="space-y-3">
          {filteredChallenges.map((challenge) => {
            const challengeMemories = getChallengeMemories(challenge.id);
            const done = challengeMemories.length > 0;
            const latestMemory = getLatestMemory(challenge.id);

            return (
              <Card
                key={challenge.id}
                className={`cursor-pointer border-none shadow-sm transition-all hover:shadow-md ${
                  done ? "bg-primary/5" : ""
                }`}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  {/* Emoji */}
                  <span className="text-2xl">{challenge.emoji}</span>

                  {/* Challenge information */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-body text-sm ${
                        done
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {challenge.title}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                        {challenge.category}
                      </span>

                      {/* Multiple memories indicator */}
                      {challengeMemories.length > 1 && (
                        <span className="text-[10px] text-muted-foreground">
                          {challengeMemories.length} souvenirs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  {done ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-primary" />

                      {/* Latest emotion rating */}
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

        {/* Empty state */}
        {filteredChallenges.length === 0 && (
          <div className="py-12 text-center">
            <span className="mb-3 block text-4xl">💕</span>

            <h2 className="font-display text-lg font-semibold">
              Aucun défi ici
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Revenez dans un autre filtre pour continuer votre aventure.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ChallengesList;