import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EmotionRating } from "./EmotionRating";
import { PhotoUploader } from "./PhotoUploader";
import { memorySchema, type MemoryFormValues } from "../schemas/memorySchema";

interface MemoryFormProps {
  maxPhotos: number;
  onSubmit: (values: MemoryFormValues, photos: string[]) => void;
  isSubmitting?: boolean;
}

export function MemoryForm({ maxPhotos, onSubmit, isSubmitting = false }: MemoryFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { isValid } } = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    mode: "onChange",
    defaultValues: { date: "", location: "", description: "", emotionRating: 0 },
  });

  const emotionRating = watch("emotionRating");
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit((values) => onSubmit(values, photos))} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="memory-date" className="font-handwritten text-lg">📅 Quand ?</Label>
            <Input id="memory-date" type="date" {...register("date")} disabled={isSubmitting} className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memory-location" className="font-handwritten text-lg">📍 Où ?</Label>
            <Input id="memory-location" {...register("location")} disabled={isSubmitting} placeholder="Ex: Paris, chez nous, au parc..." className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memory-description" className="font-handwritten text-lg">💬 Comment c'était ?</Label>
            <Textarea id="memory-description" {...register("description")} disabled={isSubmitting} placeholder="Racontez votre moment..." className="min-h-[100px] rounded-lg" />
          </div>
          <EmotionRating
            value={emotionRating}
            disabled={isSubmitting}
            onChange={(value) => setValue("emotionRating", value, { shouldValidate: true, shouldDirty: true })}
          />
          <PhotoUploader
            photos={photos}
            maxPhotos={maxPhotos}
            disabled={isSubmitting}
            onAdd={(newPhotos) => setPhotos((current) => [...current, ...newPhotos].slice(0, maxPhotos))}
            onRemove={(index) => setPhotos((current) => current.filter((_, i) => i !== index))}
          />
          <Button type="submit" size="lg" className="w-full rounded-full text-lg font-handwritten" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Valider le souvenir 💝"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
