import { useRef, type ChangeEvent } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validatePhoto } from "../utils/photoValidation";

interface PhotoUploaderProps {
  photos: string[];
  maxPhotos: number;
  disabled?: boolean;
  onAdd: (photos: string[]) => void;
  onRemove: (index: number) => void;
}

export function PhotoUploader({ photos, maxPhotos, disabled = false, onAdd, onRemove }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || disabled) return;

    const remainingSlots = Math.max(0, maxPhotos - photos.length);
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    const readers = selectedFiles.map((file) => {
      const validation = validatePhoto(file);
      if (!validation.valid) return null;

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Photo invalide"));
        reader.onerror = () => reject(new Error("Lecture de photo impossible"));
        reader.readAsDataURL(file);
      });
    }).filter((reader): reader is Promise<string> => reader !== null);

    Promise.all(readers).then((newPhotos) => newPhotos.length && onAdd(newPhotos)).catch(() => undefined);
    event.target.value = "";
  };

  const canAddMore = !disabled && photos.length < maxPhotos;

  return (
    <div className="space-y-2">
      <Label className="font-handwritten text-lg">📷 Photos</Label>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="relative aspect-square overflow-hidden rounded-lg">
            <img src={photo} alt={`Souvenir ${index + 1}`} className="h-full w-full object-cover" />
            {!disabled && <Button type="button" size="icon" variant="secondary" aria-label={`Supprimer la photo ${index + 1}`} onClick={() => onRemove(index)} className="absolute right-1 top-1 h-7 w-7 rounded-full bg-foreground/60 text-background hover:bg-foreground/80"><X className="h-3 w-3" /></Button>}
          </div>
        ))}
        {canAddMore && <button type="button" onClick={() => inputRef.current?.click()} aria-label="Ajouter une photo" className="aspect-square rounded-lg border-2 border-dashed border-muted text-muted-foreground transition-colors hover:border-primary hover:text-primary"><span className="flex h-full flex-col items-center justify-center"><Camera className="h-6 w-6" /><span className="mt-1 text-[10px]">Ajouter</span></span></button>}
      </div>
      <p className="text-xs text-muted-foreground">{photos.length}/{maxPhotos} photo{maxPhotos > 1 ? "s" : ""}</p>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" disabled={disabled} onChange={handleChange} />
    </div>
  );
}
