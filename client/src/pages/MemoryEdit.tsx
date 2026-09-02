import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmotionRating } from "@/features/memories/components/EmotionRating";
import { PhotoUploader } from "@/features/memories/components/PhotoUploader";
import { memorySchema, type MemoryFormValues } from "@/features/memories/schemas/memorySchema";

const MemoryEdit = () => {
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();
  const { memories, updateMemory } = useApp();
  const [photos, setPhotos] = useState<string[]>([]);

  const memory = useMemo(() => memories.find((item) => item.id === memoryId), [memories, memoryId]);
  const challenge = memory ? challenges.find((item) => item.id === memory.challengeId) : undefined;

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: { date: "", location: "", description: "", emotionRating: 3 },
  });

  useEffect(() => {
    if (!memory) return;
    form.reset({
      date: memory.date,
      location: memory.location ?? "",
      description: memory.description ?? "",
      emotionRating: memory.emotionRating,
    });
    setPhotos(memory.photos.map((photo) => photo.url));
  }, [memory, form]);

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Souvenir introuvable</h1>
          <Button asChild className="rounded-full mt-4"><Link to="/memories">Retour</Link></Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const onSubmit = (values: MemoryFormValues) => {
    updateMemory(memory.id, {
      date: values.date,
      location: values.location?.trim() || undefined,
      description: values.description?.trim() || undefined,
      emotionRating: values.emotionRating,
      photos: photos.map((url, index) => ({
        id: memory.photos[index]?.id ?? `${memory.id}-photo-${index}`,
        url,
        ...memory.photos[index],
      })),
    });
    navigate(`/memories/${memory.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/memories/${memory.id}`} aria-label="Retour"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">{challenge?.emoji} {challenge?.title}</p>
            <h1 className="text-2xl font-display font-bold">Modifier le souvenir</h1>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...form.register("date")} className="mt-1" />
                {form.formState.errors.date && <p className="text-sm text-destructive mt-1">{form.formState.errors.date.message}</p>}
              </div>
              <div>
                <Label htmlFor="location">Lieu</Label>
                <Input id="location" {...form.register("location")} className="mt-1" placeholder="Où étiez-vous ?" />
                {form.formState.errors.location && <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} className="mt-1 min-h-32" placeholder="Racontez ce souvenir..." />
                {form.formState.errors.description && <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>}
              </div>
              <div>
                <Label>Émotion</Label>
                <div className="mt-2">
                  <EmotionRating value={form.watch("emotionRating")} onChange={(value) => form.setValue("emotionRating", value, { shouldValidate: true })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <Label>Photos</Label>
              <div className="mt-2">
                <PhotoUploader
                  photos={photos}
                  maxPhotos={Math.max(1, memory.photos.length || 1)}
                  onAdd={(newPhotos) => setPhotos((current) => [...current, ...newPhotos])}
                  onRemove={(index) => setPhotos((current) => current.filter((_, i) => i !== index))}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
            Enregistrer les modifications
          </Button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
};

export default MemoryEdit;
