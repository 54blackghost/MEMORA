import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sortMemoriesByCompletedAt } from "@/features/memories/utils/memorySelectors";

const Memories = () => {
  const { memories } = useApp();
  const sortedMemories = useMemo(() => sortMemoriesByCompletedAt(memories), [memories]);

  if (sortedMemories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-display font-bold text-center mb-2">Aucun souvenir</h1>
        <p className="text-muted-foreground text-center font-body max-w-sm mb-6">
          Commencez un défi pour créer votre premier souvenir.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/challenges">Voir les défis</Link>
        </Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-2xl mx-auto px-4 pt-8">
        <header className="mb-6">
          <p className="text-sm text-muted-foreground font-body">Votre histoire</p>
          <h1 className="text-3xl font-display font-bold">Mes souvenirs</h1>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            {sortedMemories.length} souvenir{sortedMemories.length > 1 ? "s" : ""}
          </p>
        </header>

        <div className="space-y-4">
          {sortedMemories.map((memory) => {
            const challenge = challenges.find((item) => item.id === memory.challengeId);
            const firstPhoto = memory.photos[0]?.url;

            return (
              <Link key={memory.id} to={`/memories/${memory.id}`} className="block">
                <Card className="overflow-hidden border-none shadow-sm transition-transform hover:-translate-y-0.5">
                  <div className="flex min-h-28">
                    <div className="w-28 shrink-0 bg-secondary flex items-center justify-center">
                      {firstPhoto ? (
                        <img src={firstPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">{challenge?.emoji ?? "💭"}</span>
                      )}
                    </div>
                    <CardContent className="flex-1 p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-body">
                          {new Date(memory.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <h2 className="font-display font-semibold truncate mt-1">
                          {challenge?.emoji} {challenge?.title ?? "Souvenir"}
                        </h2>
                        {memory.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1 font-body">
                            {memory.description}
                          </p>
                        )}
                        <div className="flex gap-0.5 mt-2">
                          {Array.from({ length: memory.emotionRating }).map((_, index) => (
                            <Heart key={index} className="w-3.5 h-3.5 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Memories;
