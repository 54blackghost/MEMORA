import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Feed = () => {
  const { completedChallenges } = useApp();

  const memories = useMemo(() => {
    return [...completedChallenges]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }, [completedChallenges]);

  if (memories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6">
        <span className="text-6xl mb-4">📸</span>
        <h2 className="text-xl font-display font-semibold text-center mb-2">
          Pas encore de souvenirs
        </h2>
        <p className="text-muted-foreground text-center font-body">
          Complétez votre premier défi pour voir vos souvenirs ici !
        </p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground pb-24">
      <div className="snap-y snap-mandatory h-screen overflow-y-auto">
        {memories.map((memory) => {
          const challenge = challenges.find((c) => c.id === memory.challengeId);
          return (
            <div
              key={memory.challengeId}
              className="snap-start h-screen relative flex items-end"
            >
              {/* Background */}
              {memory.photos[0] ? (
                <img
                  src={memory.photos[0]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 to-secondary/50 flex items-center justify-center">
                  <span className="text-8xl">{challenge?.emoji}</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 pb-28 w-full text-primary-foreground">
                <span className="text-xs bg-primary/80 px-2 py-1 rounded-full capitalize font-body">
                  {challenge?.category}
                </span>
                <h2 className="text-2xl font-display font-bold mt-2 mb-1 text-card">
                  {challenge?.emoji} {challenge?.title}
                </h2>
                {memory.description && (
                  <p className="text-card/80 font-body text-sm line-clamp-3 mb-3">
                    {memory.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: memory.emotionRating }).map((_, i) => (
                      <Heart key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-card/60 text-xs font-body">
                    {new Date(memory.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
};

export default Feed;
