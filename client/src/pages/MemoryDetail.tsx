import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, Heart, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const MemoryDetail = () => {
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();
  const { memories, removeMemory } = useApp();

  const memory = useMemo(
    () => memories.find((item) => item.id === memoryId),
    [memories, memoryId],
  );
  const challenge = memory
    ? challenges.find((item) => item.id === memory.challengeId)
    : undefined;

  if (!memory) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <span className="text-5xl mb-4">🔎</span>
        <h1 className="text-2xl font-display font-bold mb-2">Souvenir introuvable</h1>
        <p className="text-muted-foreground text-center mb-6 font-body">
          Ce souvenir n'existe plus ou son identifiant est incorrect.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/memories">Retour aux souvenirs</Link>
        </Button>
        <BottomNav />
      </div>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm("Supprimer définitivement ce souvenir ?");
    if (!confirmed) return;
    removeMemory(memory.id);
    navigate("/memories", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/memories" aria-label="Retour">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/memories/${memory.id}/edit`} aria-label="Modifier">
                <Edit3 className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete} aria-label="Supprimer">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {memory.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {memory.photos.map((photo) => (
              <div key={photo.id} className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <article>
          <p className="text-sm text-muted-foreground font-body">
            {new Date(memory.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {memory.location ? ` · ${memory.location}` : ""}
          </p>
          <h1 className="text-3xl font-display font-bold mt-2">
            {challenge?.emoji} {challenge?.title ?? "Souvenir"}
          </h1>

          <div className="flex gap-1 mt-4">
            {Array.from({ length: memory.emotionRating }).map((_, index) => (
              <Heart key={index} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>

          {memory.description && (
            <p className="mt-6 text-base leading-7 font-body whitespace-pre-wrap">
              {memory.description}
            </p>
          )}
        </article>
      </main>
      <BottomNav />
    </div>
  );
};

export default MemoryDetail;
