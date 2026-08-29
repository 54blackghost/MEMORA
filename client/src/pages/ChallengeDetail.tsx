import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp, CompletedChallenge } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Camera, X, Check } from "lucide-react";
import confetti from "canvas-confetti";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeChallenge, getCompletedChallenge } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const challenge = challenges.find((c) => c.id === Number(id));
  const existing = getCompletedChallenge(Number(id));

  const [date, setDate] = useState(existing?.date || "");
  const [location, setLocation] = useState(existing?.location || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [emotionRating, setEmotionRating] = useState(existing?.emotionRating || 0);
  const [photos, setPhotos] = useState<string[]>(existing?.photos || []);
  const [validated, setValidated] = useState(!!existing);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Défi introuvable</p>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!date || emotionRating === 0) return;
    const memory: CompletedChallenge = {
      challengeId: challenge.id,
      date,
      location,
      description,
      emotionRating,
      photos,
      completedAt: new Date().toISOString(),
    };
    completeChallenge(memory);
    setValidated(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#c4735a", "#e8b4b8", "#f5e6d3", "#d4a574"],
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 max-w-lg mx-auto">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="text-center mb-6 animate-fade-in">
          <span className="text-5xl mb-3 block">{challenge.emoji}</span>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {challenge.title}
          </h1>
          <span className="text-xs text-muted-foreground capitalize bg-secondary px-3 py-1 rounded-full mt-2 inline-block">
            {challenge.category}
          </span>
        </div>

        {validated && (
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span className="font-handwritten text-lg">Souvenir validé !</span>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="border-none shadow-md animate-fade-in">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="font-handwritten text-lg">📅 Quand ?</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-handwritten text-lg">📍 Où ?</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Paris, chez nous, au parc..."
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-handwritten text-lg">💬 Comment c'était ?</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Racontez votre moment..."
                className="rounded-lg min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-handwritten text-lg">❤️ Note émotion</Label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setEmotionRating(n)}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      className={`w-8 h-8 transition-colors ${
                        n <= emotionRating
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label className="font-handwritten text-lg">📷 Photos</Label>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-foreground/60 text-background rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] mt-1">Ajouter</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {!validated && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full rounded-full text-lg font-handwritten"
                disabled={!date || emotionRating === 0}
              >
                Valider le souvenir 💝
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetail;
