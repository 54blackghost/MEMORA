import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Camera, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useMemo } from "react";

const Dashboard = () => {
  const { profile, completedChallenges, isCompleted } = useApp();
  const navigate = useNavigate();

  const completedCount = completedChallenges.length;
  const progress = (completedCount / 101) * 100;

  const dailyChallenge = useMemo(() => {
    const uncompleted = challenges.filter((c) => !isCompleted(c.id));
    if (uncompleted.length === 0) return challenges[0];
    const dayIndex = new Date().getDate() % uncompleted.length;
    return uncompleted[dayIndex];
  }, [isCompleted]);

  const lastMemories = useMemo(() => {
    return [...completedChallenges]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 3);
  }, [completedChallenges]);

  const complicityScore = useMemo(() => {
    if (completedChallenges.length === 0) return 0;
    const avgEmotion =
      completedChallenges.reduce((sum, c) => sum + c.emotionRating, 0) /
      completedChallenges.length;
    return Math.round((completedCount / 101) * 50 + avgEmotion * 10);
  }, [completedChallenges, completedCount]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <p className="text-muted-foreground font-body text-sm">Bienvenue</p>
          <h1 className="text-2xl font-handwritten text-primary">
            {profile?.coupleName || "Mon duo"} 💕
          </h1>
        </div>

        {/* Progress */}
        <Card className="mb-6 border-none shadow-md animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm font-semibold">Progression</span>
              <span className="text-primary font-handwritten text-lg">
                {completedCount}/101
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-secondary" />
          </CardContent>
        </Card>

        {/* Complicity Score */}
        <Card className="mb-6 border-none shadow-md bg-primary/5 animate-fade-in">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">Score de complicité</p>
              <p className="text-3xl font-handwritten text-primary">{complicityScore}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenge */}
        <Card
          className="mb-6 border-none shadow-md cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
          onClick={() => navigate(`/challenge/${dailyChallenge.id}`)}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">
                Défi du jour
              </span>
            </div>
            <p className="text-xl font-display font-semibold text-foreground mb-1">
              {dailyChallenge.emoji} {dailyChallenge.title}
            </p>
            <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded-full">
              {dailyChallenge.category}
            </span>
          </CardContent>
        </Card>

        {/* CTA */}
        <Button
          onClick={() => navigate("/challenges")}
          size="lg"
          className="w-full rounded-full text-lg font-handwritten mb-6"
        >
          Relever un défi 🎯
        </Button>

        {/* Last Memories */}
        {lastMemories.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Derniers souvenirs
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {lastMemories.map((memory) => {
                const challenge = challenges.find((c) => c.id === memory.challengeId);
                return (
                  <Card
                    key={memory.challengeId}
                    className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => navigate(`/challenge/${memory.challengeId}`)}
                  >
                    <div className="aspect-square relative bg-secondary">
                      {memory.photos[0] ? (
                        <img
                          src={memory.photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {challenge?.emoji}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <p className="text-xs font-body truncate">{challenge?.title}</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: memory.emotionRating }).map((_, i) => (
                          <Heart key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
