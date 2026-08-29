import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Download, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import jsPDF from "jspdf";

const Album = () => {
  const { completedChallenges, profile } = useApp();
  const [currentPage, setCurrentPage] = useState(0);

  const memories = useMemo(() => {
    return [...completedChallenges].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
  }, [completedChallenges]);

  const exportPDF = async () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    // Cover page
    pdf.setFillColor(245, 230, 211);
    pdf.rect(0, 0, w, h, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(80, 50, 40);
    pdf.text("Notre Album", w / 2, h / 3, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(profile?.coupleName || "Notre duo", w / 2, h / 3 + 12, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`${memories.length} souvenirs`, w / 2, h / 3 + 22, { align: "center" });

    for (const memory of memories) {
      pdf.addPage();
      const challenge = challenges.find((c) => c.id === memory.challengeId);

      pdf.setFillColor(245, 230, 211);
      pdf.rect(0, 0, w, h, "F");

      let yPos = 15;

      // Photo
      if (memory.photos[0]) {
        try {
          pdf.addImage(memory.photos[0], "JPEG", 15, yPos, w - 30, 80);
          yPos += 88;
        } catch {
          yPos += 5;
        }
      }

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(80, 50, 40);
      pdf.text(`${challenge?.emoji || ""} ${challenge?.title || ""}`, w / 2, yPos, {
        align: "center",
        maxWidth: w - 30,
      });
      yPos += 12;

      // Date & Location
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
      pdf.setTextColor(120, 100, 80);
      const dateStr = new Date(memory.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      pdf.text(`${dateStr}${memory.location ? ` — ${memory.location}` : ""}`, w / 2, yPos, {
        align: "center",
      });
      yPos += 10;

      // Description
      if (memory.description) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(60, 40, 30);
        const lines = pdf.splitTextToSize(memory.description, w - 30);
        pdf.text(lines, 15, yPos);
        yPos += lines.length * 5 + 5;
      }

      // Hearts
      const hearts = "❤️".repeat(memory.emotionRating);
      pdf.setFontSize(12);
      pdf.text(hearts, w / 2, yPos, { align: "center" });
    }

    pdf.save(`album-${profile?.coupleName || "souvenirs"}.pdf`);
  };

  if (memories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-display font-semibold text-center mb-2">
          Votre album est vide
        </h2>
        <p className="text-muted-foreground text-center font-body">
          Complétez des défis pour remplir votre album de souvenirs !
        </p>
        <BottomNav />
      </div>
    );
  }

  const current = memories[currentPage];
  const challenge = challenges.find((c) => c.id === current?.challengeId);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-display font-bold text-center mb-2">Mon Album</h1>
        <p className="text-center text-muted-foreground font-body text-sm mb-6">
          {memories.length} souvenir{memories.length > 1 ? "s" : ""}
        </p>

        {/* Flipbook */}
        <Card className="border-none shadow-lg mb-6 animate-fade-in overflow-hidden" key={currentPage}>
          <div className="bg-accent/30 min-h-[420px] flex flex-col">
            {/* Photo area */}
            {current?.photos[0] ? (
              <div className="h-48 overflow-hidden">
                <img src={current.photos[0]} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-secondary">
                <span className="text-6xl">{challenge?.emoji}</span>
              </div>
            )}

            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body mb-1">
                  {new Date(current.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {current.location && ` — ${current.location}`}
                </p>
                <h2 className="text-lg font-display font-bold mb-3">
                  {challenge?.emoji} {challenge?.title}
                </h2>
                {current.description && (
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {current.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: current.emotionRating }).map((_, i) => (
                  <Heart key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-body">
            {currentPage + 1} / {memories.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((p) => Math.min(memories.length - 1, p + 1))}
            disabled={currentPage === memories.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <Button
          onClick={exportPDF}
          size="lg"
          className="w-full rounded-full text-lg font-handwritten mb-3"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger en PDF
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full text-lg font-handwritten"
          disabled
        >
          Commander l'album imprimé 📖
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Album;
