import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Filter = "all" | "done" | "todo";

const ChallengesList = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const { isCompleted, getCompletedChallenge } = useApp();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (filter === "done") return challenges.filter((c) => isCompleted(c.id));
    if (filter === "todo") return challenges.filter((c) => !isCompleted(c.id));
    return challenges;
  }, [filter, isCompleted]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-display font-bold text-center mb-4">
          101 Défis
        </h1>

        {/* Filters */}
        <div className="flex gap-2 justify-center mb-6">
          {([
            ["all", "Tous"],
            ["todo", "À faire"],
            ["done", "Complétés"],
          ] as [Filter, string][]).map(([key, label]) => (
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

        {/* List */}
        <div className="space-y-3">
          {filtered.map((challenge) => {
            const done = isCompleted(challenge.id);
            const memory = getCompletedChallenge(challenge.id);
            return (
              <Card
                key={challenge.id}
                className={`border-none shadow-sm cursor-pointer hover:shadow-md transition-all ${
                  done ? "bg-primary/5" : ""
                }`}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{challenge.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm ${done ? "text-muted-foreground" : "text-foreground"}`}>
                      {challenge.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-full">
                      {challenge.category}
                    </span>
                  </div>
                  {done ? (
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-primary" />
                      <div className="flex gap-0.5">
                        {Array.from({ length: memory?.emotionRating || 0 }).map((_, i) => (
                          <Heart key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">#{challenge.id}</span>
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
