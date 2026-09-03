import { Check, Crown, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { plans } from "@/lib/subscription/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureLabels: Record<string, string> = {
  basic_challenges: "10 défis gratuits",
  premium_challenges: "Défis premium",
  photo_upload: "1 photo par souvenir",
  multiple_photos: "Plusieurs photos par souvenir",
  basic_pdf_export: "Téléchargement de l'album PDF",
  pdf_album: "Fonctionnalités avancées de l'album",
  printed_album: "Album imprimé",
  ai_memories: "Souvenirs assistés par IA",
  advanced_statistics: "Statistiques avancées",
  couple_customization: "Personnalisation du couple",
};

const Subscription = () => {
  const navigate = useNavigate();
  const { subscription, setSubscription, memories } = useApp();

  const handleChoosePlan = (planId: "free" | "premium" | "couple_plus") => {
    if (planId === subscription.plan) return;

    // Temporary local/demo subscription switch.
    // Real payment + server-side entitlement enforcement comes with the backend.
    setSubscription({
      plan: planId,
      status: "active",
      startedAt: new Date().toISOString(),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <main className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour
        </button>

        <header className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            Choisissez votre expérience MEMORA
          </h1>
          <p className="mt-3 text-muted-foreground">
            Commencez gratuitement avec 10 défis, puis passez à Premium
            quand vous voulez conserver encore plus de souvenirs.
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">
              Votre progression : {memories.length} souvenir{memories.length > 1 ? "s" : ""}
            </span>
          </div>
          {subscription.plan === "free" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Formule gratuite : jusqu'à 10 souvenirs et 10 défis gratuits.
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const current = subscription.plan === plan.id;
            const popular = plan.id === "premium";

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col border-none shadow-md ${
                  popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Le plus populaire
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 font-display text-xl">
                    {plan.id === "free" && "🌱"}
                    {plan.id === "premium" && <Sparkles className="h-5 w-5 text-primary" />}
                    {plan.id === "couple_plus" && <Crown className="h-5 w-5 text-primary" />}
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="pt-3">
                    <span className="font-display text-3xl font-bold">
                      {plan.priceMonthly === 0
                        ? "Gratuit"
                        : `${plan.priceMonthly.toFixed(2)} €`}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-sm text-muted-foreground"> / mois</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6 space-y-3">
                    <div className="rounded-xl bg-secondary/60 p-3 text-sm">
                      <strong>
                        {plan.limits.maxMemories === null
                          ? "Souvenirs illimités"
                          : `${plan.limits.maxMemories} souvenirs maximum`}
                      </strong>
                    </div>

                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{featureLabels[feature] ?? feature}</span>
                      </div>
                    ))}

                    <div className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        Jusqu'à {plan.limits.maxPhotosPerMemory} photo
                        {plan.limits.maxPhotosPerMemory > 1 ? "s" : ""} par souvenir
                      </span>
                    </div>
                  </div>

                  <Button
                    className="mt-auto w-full rounded-full"
                    variant={current ? "outline" : "default"}
                    disabled={current}
                    onClick={() => handleChoosePlan(plan.id)}
                  >
                    {current
                      ? "Formule actuelle"
                      : plan.id === "free"
                        ? "Passer à Free"
                        : `Choisir ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Les prix affichés sont provisoires pour la phase frontend.
          Le paiement réel, les factures et la validation serveur seront
          branchés avec le backend.
        </p>
      </main>
    </div>
  );
};

export default Subscription;

