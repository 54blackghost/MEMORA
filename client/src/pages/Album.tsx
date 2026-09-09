import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronLeft, ChevronRight, Download } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { sortMemoriesByCompletedAt } from "@/features/memories/utils/memorySelectors";
import { generateAlbumPdf } from "@/lib/pdf/albumPdf";

const Album = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { profile, memories } = useApp();

  const sortedMemories = useMemo(
    () => sortMemoriesByCompletedAt(memories, "asc"),
    [memories],
  );

  if (sortedMemories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-display font-semibold text-center mb-2">
          Votre album est vide
        </h2>
        <p className="text-muted-foreground text-center font-body">
          Complétez des défis pour remplir votre album de souvenirs !
        </p>
        <BottomNav />
      </div>
    );
  }

  const current = sortedMemories[currentPage];
  const challenge = current
    ? challenges.find((item) => item.id === current.challengeId)
    : undefined;

  const exportPDF = () => {
    generateAlbumPdf({ memories: sortedMemories, profile });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="mx-auto max-w-lg px-6 pt-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Mon Album</h1>
            <p className="text-sm text-muted-foreground">
              {sortedMemories.length} souvenir{sortedMemories.length > 1 ? "s" : ""}
            </p>
          </div>
          <Button type="button" variant="outline" className="rounded-full" onClick={exportPDF}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="aspect-[4/5] bg-secondary">
            {current?.photos[0]?.url ? (
              <img
                src={current.photos[0].url}
                alt={challenge?.title ?? "Souvenir"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">📖</div>
            )}
          </div>
          <CardContent className="p-6">
            <p className="mb-1 text-xs text-muted-foreground">
              {current && new Date(current.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {current?.location && ` — ${current.location}`}
            </p>
            <h2 className="font-display text-lg font-bold">
              {challenge?.emoji} {challenge?.title ?? "Notre souvenir"}
            </h2>
            {current?.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {current.description}
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Émotion : {current?.emotionRating}/5
            </p>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
            aria-label="Souvenir précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} / {sortedMemories.length}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            disabled={currentPage === sortedMemories.length - 1}
            onClick={() => setCurrentPage((page) => Math.min(sortedMemories.length - 1, page + 1))}
            aria-label="Souvenir suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Album;

