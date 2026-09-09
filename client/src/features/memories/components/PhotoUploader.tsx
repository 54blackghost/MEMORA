import { useRef, useState, type ChangeEvent } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validatePhoto } from "../utils/photoValidation";
import { legacyDataUrlPhotoStorage, type PhotoStorage, type StoredPhoto } from "@/lib/media/photoStorage";

interface PhotoUploaderProps {
  photos: StoredPhoto[];
  maxPhotos: number;
  memoryId: string;
  storage?: PhotoStorage;
  disabled?: boolean;
  onAdd: (photos: StoredPhoto[]) => void;
  onRemove: (index: number) => void;
}

export function PhotoUploader({
  photos,
  maxPhotos,
  memoryId,
  storage = legacyDataUrlPhotoStorage,
  disabled = false,
  onAdd,
  onRemove,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || disabled) return;

    const remainingSlots = Math.max(0, maxPhotos - photos.length);
    if (remainingSlots === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const selectedFiles = files.slice(0, remainingSlots);
      const invalid = selectedFiles.find((file) => !validatePhoto(file).valid);
      if (invalid) {
        setError("Une ou plusieurs photos ne respectent pas le format ou la taille autorisés.");
        return;
      }

      const uploaded = await Promise.all(
        selectedFiles.map((file) => storage.upload({ file, memoryId })),
      );
      onAdd(uploaded);
    } catch (uploadError) {
      console.error("Photo upload failed", uploadError);
      setError("Impossible d'ajouter les photos. Réessayez.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const photo = photos[index];
    if (!photo || disabled) return;
    if (photo.storageKey) {
      try {
        await storage.remove(photo.storageKey);
      } catch (removeError) {
        console.error("Photo removal failed", removeError);
      }
    }
    onRemove(index);
  };

  const canAddMore = !disabled && !isUploading && photos.length < maxPhotos;

  return (
    <div className="space-y-2">
      <Label className="font-handwritten text-lg">📷 Photos</Label>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg">
            <img src={photo.url} alt={`Souvenir ${index + 1}`} className="h-full w-full object-cover" />
            {!disabled && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                aria-label={`Supprimer la photo ${index + 1}`}
                onClick={() => void handleRemove(index)}
                className="absolute right-1 top-1 h-7 w-7 rounded-full bg-foreground/60 text-background hover:bg-foreground/80"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Ajouter une photo"
            className="aspect-square rounded-lg border-2 border-dashed border-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span className="flex h-full flex-col items-center justify-center">
              <Camera className="h-6 w-6" />
              <span className="mt-1 text-[10px]">Ajouter</span>
            </span>
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {photos.length}/{maxPhotos} photo{maxPhotos > 1 ? "s" : ""}
      </p>
      {isUploading && <p className="text-xs text-muted-foreground">Ajout des photos…</p>}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleChange}
      />
    </div>
  );
}
