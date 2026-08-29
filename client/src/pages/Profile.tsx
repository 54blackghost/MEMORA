import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

const Profile = () => {
  const { setProfile } = useApp();
  const navigate = useNavigate();
  const [coupleName, setCoupleName] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleName.trim()) return;
    setProfile({ coupleName: coupleName.trim(), startDate: startDate || undefined });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-background">
      <div className="w-full max-w-sm mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Votre duo
          </h1>
          <p className="text-muted-foreground font-body">
            Comment vous appelez-vous ?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coupleName" className="font-handwritten text-lg">
              Nom du couple / duo
            </Label>
            <Input
              id="coupleName"
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder="Ex: Marie & Thomas"
              className="text-center text-lg rounded-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="font-handwritten text-lg">
              Date de début (optionnel)
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-center rounded-full"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-lg font-handwritten"
            disabled={!coupleName.trim()}
          >
            C'est parti ! 💕
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
