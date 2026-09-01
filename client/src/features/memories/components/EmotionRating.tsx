import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";

interface EmotionRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function EmotionRating({
  value,
  onChange,
  disabled = false,
}: EmotionRatingProps) {
  return (
    <div className="space-y-2">
      <Label className="font-handwritten text-lg">
        ❤️ Note émotion
      </Label>

      <div
        className="flex justify-center gap-2"
        role="radiogroup"
        aria-label="Note émotion"
      >
        {[1, 2, 3, 4, 5].map((rating) => {
          const active = rating <= value;

          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${rating} sur 5`}
              disabled={disabled}
              onClick={() => onChange(rating)}
              className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed"
            >
              <Heart
                className={`h-8 w-8 transition-colors ${
                  active
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}