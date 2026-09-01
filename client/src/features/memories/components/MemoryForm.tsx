import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Label,
} from "@/components/ui/label";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  EmotionRating,
} from "./EmotionRating";

import {
  PhotoUploader,
} from "./PhotoUploader";

import {
  memorySchema,
  type MemoryFormValues,
} from "../schemas/memorySchema";

interface MemoryFormProps {
  initialValues?: Partial<MemoryFormValues>;
  initialPhotos?: string[];
  maxPhotos: number;
  validated: boolean;

  onSubmit: (
    values: MemoryFormValues,
    photos: string[]
  ) => void;
}

export function MemoryForm({
  initialValues,
  initialPhotos = [],
  maxPhotos,
  validated,
  onSubmit,
}: MemoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      isValid,
    },
  } = useForm<MemoryFormValues>({
    resolver: zodResolver(
      memorySchema
    ),

    mode: "onChange",

    defaultValues: {
      date: initialValues?.date ?? "",
      location:
        initialValues?.location ?? "",
      description:
        initialValues?.description ?? "",
      emotionRating:
        initialValues?.emotionRating ?? 0,
    },
  });

  const emotionRating =
    watch("emotionRating");

  const [photos, setPhotos] =
    useState<string[]>(
      initialPhotos.slice(0, maxPhotos)
    );

  useEffect(() => {
    setPhotos(
      initialPhotos.slice(0, maxPhotos)
    );
  }, [initialPhotos, maxPhotos]);

  const submit = (
    values: MemoryFormValues
  ) => {
    onSubmit(values, photos);
  };

  return (
    <Card className="border-none shadow-md">
      <CardContent className="space-y-5 p-6">
        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label
              htmlFor="memory-date"
              className="font-handwritten text-lg"
            >
              📅 Quand ?
            </Label>

            <Input
              id="memory-date"
              type="date"
              {...register("date")}
              disabled={validated}
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="memory-location"
              className="font-handwritten text-lg"
            >
              📍 Où ?
            </Label>

            <Input
              id="memory-location"
              {...register("location")}
              disabled={validated}
              placeholder="Ex: Paris, chez nous, au parc..."
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="memory-description"
              className="font-handwritten text-lg"
            >
              💬 Comment c'était ?
            </Label>

            <Textarea
              id="memory-description"
              {...register("description")}
              disabled={validated}
              placeholder="Racontez votre moment..."
              className="min-h-[100px] rounded-lg"
            />
          </div>

          <EmotionRating
            value={emotionRating}
            disabled={validated}
            onChange={(value) =>
              setValue(
                "emotionRating",
                value,
                {
                  shouldValidate: true,
                }
              )
            }
          />

          <PhotoUploader
            photos={photos}
            maxPhotos={maxPhotos}
            onAdd={(newPhotos) =>
              setPhotos((current) =>
                [
                  ...current,
                  ...newPhotos,
                ].slice(0, maxPhotos)
              )
            }
            onRemove={(index) =>
              setPhotos((current) =>
                current.filter(
                  (_, i) =>
                    i !== index
                )
              )
            }
          />

          {!validated && (
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full text-lg font-handwritten"
              disabled={!isValid}
            >
              Valider le souvenir 💝
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}