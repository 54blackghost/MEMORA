import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { can, getLimit } from "@/lib/subscription/entitlements";
import { getChallengeAccess } from "@/lib/challenges/challengeAccess";
import { MemoryForm } from "@/features/memories/components/MemoryForm";
import { createMemory } from "@/features/memories/utils/createMemory";
import {
  canCreateMemory,
  getRemainingMemorySlots,
} from "@/features/memories/utils/memoryEntitlements";
import type { MemoryFormValues } from "@/features/memories/schemas/memorySchema";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { memories, addMemory, subscription } = useApp();
  const challengeId = Number(id);
  const challenge = challenges.find((item) => item.id === challengeId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [success, setSuccess] = useState(false);

  const challengeMemories = useMemo(
    () =>
      memories.filter((memory) => memory.challengeId === challengeId),
    [memories, challengeId],
  );

  if (!challenge || !Number.isInteger(challengeId)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="font-display text-lg font-semibold">
            Défi introuvable
          </p>
          <button
            type="button"
            onClick={() => navigate("/challenges")}
            className="mt-3 text-sm text-primary underline"
          >
            Retour aux défis
          </button>
        </div>
      </div>
    );
  }

  const access = getChallengeAccess(challenge);
  const hasPremiumAccess =
    access === "free" || can("premium_challenges", subscription);

  const canCreate = canCreateMemory(memories, subscription);
  const planMaxPhotos = Math.max(
    1,
    getLimit("maxPhotosPerMemory", subscription) ?? 1,
  );
  const effectiveMaxPhotos = can("multiple_photos", subscription)
    ? planMaxPhotos
    : 1;
  const remainingMemorySlots = getRemainingMemorySlots(
    memories,
    subscription,
  );

  const handleSubmit = async (
    values: MemoryFormValues,
    photos: string[],
  ) => {
    if (!canCreate || !hasPremiumAccess) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      addMemory(
        createMemory({
          challengeId: challenge.id,
          values,
          photos: photos.slice(0, effectiveMaxPhotos),
        }),
      );
      setSuccess(true);
      setFormKey((current) => current + 1);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="mx-auto max-w-lg px-6 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="mb-6 animate-fade-in text-center">
          <span className="mb-3 block text-5xl">{challenge.emoji}</span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {challenge.title}
          </h1>
          <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs capitalize text-muted-foreground">
            {challenge.category}
          </span>
          {access === "premium" && (
            <span className="ml-2 mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <Lock className="h-3 w-3" />
              Premium
            </span>
          )}
          {challengeMemories.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {challengeMemories.length} souvenir
              {challengeMemories.length > 1 ? "s" : ""} déjà enregistré
              {challengeMemories.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!hasPremiumAccess ? (
          <UpgradeMessage onUpgrade={() => navigate("/subscription")} />
        ) : !canCreate ? (
          <LimitMessage
            remaining={remainingMemorySlots}
            onUpgrade={() => navigate("/subscription")}
          />
        ) : (
          <>
            {success && (
              <div className="mb-6 rounded-2xl bg-primary/10 p-4 text-center text-primary">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="font-handwritten text-lg">
                    Souvenir enregistré !
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tu peux en créer un autre pour ce même défi.
                </p>
              </div>
            )}
            <MemoryForm
              key={formKey}
              maxPhotos={effectiveMaxPhotos}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

function UpgradeMessage({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-md">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="font-display text-lg font-semibold">
        Défi Premium
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ce défi est réservé aux abonnés Premium. Passe à une formule
        supérieure pour débloquer les défis premium.
      </p>
      <ButtonUpgrade onClick={onUpgrade} />
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        Plus de défis, plus de souvenirs.
      </div>
    </div>
  );
}

function ButtonUpgrade({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
    >
      Voir les abonnements
    </button>
  );
}

function LimitMessage({
  remaining,
  onUpgrade,
}: {
  remaining: number | null;
  onUpgrade: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-md">
      <span className="text-4xl">📚</span>
      <h2 className="mt-3 font-display text-lg font-semibold">
        Limite de souvenirs atteinte
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ton abonnement actuel ne permet plus de créer de nouveaux souvenirs.
        Passe à une formule supérieure pour continuer.
      </p>
      {remaining !== null && (
        <p className="mt-3 text-xs text-muted-foreground">
          Places restantes : {remaining}
        </p>
      )}
      <ButtonUpgrade onClick={onUpgrade} />
    </div>
  );
}

export default ChallengeDetail;
