import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import confetti from "canvas-confetti";

import {
  ArrowLeft,
  Check,
} from "lucide-react";

import {
  useApp,
} from "@/context/AppContext";

import {
  challenges,
} from "@/data/challenges";

import {
  can,
  getLimit,
} from "@/lib/subscription/entitlements";

/*
import {
  createMemory,
} from "@/features/memories/utils/createMemory";

*/
import {
  MemoryForm,
} from "@/features/memories/components/MemoryForm";

import type {
  MemoryFormValues,
} from "@/features/memories/schemas/memorySchema";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    memories,
    addMemory,
    subscription,
  } = useApp();

  const challengeId = Number(id);

  const challenge = challenges.find(
    (item) => item.id === challengeId
  );

  const existingMemory = useMemo(
    () =>
      memories.find(
        (memory) =>
          memory.challengeId ===
          challengeId
      ),
    [memories, challengeId]
  );

  const [validated, setValidated] =
    useState(Boolean(existingMemory));

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Défi introuvable</p>
      </div>
    );
  }

  const maxPhotos =
    getLimit(
      "maxPhotosPerMemory",
      subscription
    ) ?? 1;

  const handleSubmit = (
    values: MemoryFormValues,
    photos: string[]
  ) => {
    const memory = createMemory({
      challengeId: challenge.id,
      values,
      photos,
    });

    addMemory(memory);

    setValidated(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: {
        y: 0.6,
      },
      colors: [
        "#c4735a",
        "#e8b4b8",
        "#f5e6d3",
        "#d4a574",
      ],
    });
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
          <span className="mb-3 block text-5xl">
            {challenge.emoji}
          </span>

          <h1 className="font-display text-2xl font-bold text-foreground">
            {challenge.title}
          </h1>

          <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs capitalize text-muted-foreground">
            {challenge.category}
          </span>
        </div>

        {validated && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Check className="h-4 w-4" />

              <span className="font-handwritten text-lg">
                Souvenir validé !
              </span>
            </div>
          </div>
        )}

        <MemoryForm
          initialValues={
            existingMemory
              ? {
                  date:
                    existingMemory.date,
                  location:
                    existingMemory.location,
                  description:
                    existingMemory.description,
                  emotionRating:
                    existingMemory.emotionRating,
                }
              : undefined
          }
          initialPhotos={
            existingMemory?.photos.map(
              (photo) => photo.url
            ) ?? []
          }
          maxPhotos={maxPhotos}
          validated={validated}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChallengeDetail;