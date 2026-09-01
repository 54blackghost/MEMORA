import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Heart,
  Sparkles,
  Crown,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { can } from "@/lib/subscription/entitlements";
import { getDailyChallenge } from "@/lib/challenges/dailyChallenge";
import { calculateComplicityScore } from "@/lib/scoring/complicityScore";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";




const TOTAL_CHALLENGES = challenges.length;

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, memories, subscription } = useApp();

  const completedCount = memories.length;

  const progress = useMemo(
    () =>
      TOTAL_CHALLENGES > 0
        ? Math.min((completedCount / TOTAL_CHALLENGES) * 100, 100)
        : 0,
    [completedCount]
  );

  const completedChallengeIds = useMemo(
    () => new Set(memories.map((memory) => memory.challengeId)),
    [memories]
  );

  const dailyChallenge = useMemo(
    () =>
      getDailyChallenge({
        challenges,
        completedIds: completedChallengeIds,
        canAccess: (challenge) =>
          challenge.access === "free" ||
          can("premium_challenges", subscription),
      }),
    [completedChallengeIds, subscription]
  );

  const lastMemories = useMemo(
    () =>
      [...memories]
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        )
        .slice(0, 3),
    [memories]
  );

  const complicityScore = useMemo(
    () =>
      calculateComplicityScore(
        memories,
        TOTAL_CHALLENGES
      ),
    [memories]
  );

  const isPremium =
    subscription.plan === "premium" ||
    subscription.plan === "couple_plus";

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <p className="text-muted-foreground font-body text-sm">
            Bienvenue
          </p>
          <h1 className="text-2xl font-handwritten text-primary">
            {profile?.coupleName || "Mon duo"} 💕
          </h1>
        </header>

        <Card className="mb-6 border-none shadow-md animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm font-semibold">
                Progression
              </span>

              <span className="text-primary font-handwritten text-lg">
                {completedCount}/{TOTAL_CHALLENGES}
              </span>
            </div>

            <Progress
              value={progress}
              className="h-3 bg-secondary"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(progress)}% des défis relevés
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-none shadow-md bg-primary/5 animate-fade-in">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-body">
                Score de complicité
              </p>
              <p className="text-3xl font-handwritten text-primary">
                {complicityScore}%
              </p>
            </div>
          </CardContent>
        </Card>

        {dailyChallenge ? (
          <Card
            className="mb-6 border-none shadow-md cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
            onClick={() =>
              navigate(`/challenge/${dailyChallenge.id}`)
            }
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">
                    Défi du jour
                  </span>
                </div>

                {dailyChallenge.access === "premium" && (
                  <Crown className="w-4 h-4 text-primary" />
                )}
              </div>

              <p className="text-xl font-display font-semibold text-foreground mb-1">
                {dailyChallenge.emoji} {dailyChallenge.title}
              </p>

              <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded-full">
                {dailyChallenge.category}
              </span>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-none shadow-md">
            <CardContent className="p-5 text-center">
              <p className="font-display font-semibold">
                Tous les défis accessibles sont terminés 🎉
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => navigate("/challenges")}
          size="lg"
          className="w-full rounded-full text-lg font-handwritten mb-6"
        >
          Relever un défi 🎯
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {!isPremium && (
          <Card className="mb-6 border-primary/20 bg-primary/5 animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1">
                  <h2 className="font-display font-semibold">
                    Passez à Premium
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Débloquez les défis premium, plusieurs photos par
                    souvenir et les statistiques avancées.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-3 rounded-full"
                    onClick={() => navigate("/subscription")}
                  >
                    Découvrir les offres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {lastMemories.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Derniers souvenirs
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {lastMemories.map((memory) => {
                const challenge = challenges.find(
                  (item) => item.id === memory.challengeId
                );

                const firstPhoto = memory.photos[0]?.url;

                return (
                  <Card
                    key={memory.id ?? `${memory.challengeId}-${memory.completedAt}`}
                    className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() =>
                      navigate(`/challenge/${memory.challengeId}`)
                    }
                  >
                    <div className="aspect-square relative bg-secondary">
                      {firstPhoto ? (
                        <img
                          src={firstPhoto}
                          alt={challenge?.title ?? "Souvenir"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {challenge?.emoji ?? "💕"}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-2">
                      <p className="text-xs font-body truncate">
                        {challenge?.title ?? "Souvenir"}
                      </p>

                      <div className="flex gap-0.5 mt-1" aria-label={`Note ${memory.emotionRating} sur 5`}>
                        {Array.from(
                          { length: memory.emotionRating },
                          (_, index) => (
                            <Heart
                              key={index}
                              className="w-3 h-3 fill-primary text-primary"
                              aria-hidden="true"
                            />
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
