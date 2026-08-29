import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Camera } from "lucide-react";

const slides = [
  {
    icon: <Heart className="w-16 h-16 text-primary mx-auto" />,
    title: "Créez vos plus beaux souvenirs",
    subtitle: "Documentez chaque moment précieux de votre histoire à deux",
  },
  {
    icon: <BookOpen className="w-16 h-16 text-primary mx-auto" />,
    title: "101 défis à vivre ensemble",
    subtitle: "Des expériences uniques qui renforceront votre complicité",
  },
  {
    icon: <Camera className="w-16 h-16 text-primary mx-auto" />,
    title: "Transformez vos moments en album unique",
    subtitle: "Un livre souvenir digital que vous garderez pour toujours",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { setOnboardingDone } = useApp();

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      setOnboardingDone();
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-background">
      <div className="w-full max-w-sm mx-auto text-center animate-fade-in" key={current}>
        <div className="mb-8 p-6 rounded-full bg-secondary/50 inline-block">
          {slides[current].icon}
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          {slides[current].title}
        </h1>
        <p className="text-muted-foreground text-lg mb-12 font-body">
          {slides[current].subtitle}
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      <Button
        onClick={next}
        size="lg"
        className="w-full max-w-sm rounded-full text-lg font-handwritten"
      >
        {current === slides.length - 1 ? "Commencer ✨" : "Suivant"}
      </Button>

      {current < slides.length - 1 && (
        <button
          onClick={() => { setOnboardingDone(); navigate("/profile"); }}
          className="mt-4 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Passer
        </button>
      )}
    </div>
  );
};

export default Onboarding;
