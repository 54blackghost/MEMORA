import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Download, ChevronLeft, ChevronRight, BookOpen, Crown } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { can } from "@/lib/subscription/entitlements";
import jsPDF from "jspdf";

const Album = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { profile, memories, subscription } = useApp();

  const sortedMemories = useMemo(
    () =>
      [...memories].sort(
        (a, b) =>
          new Date(a.completedAt).getTime() -
          new Date(b.completedAt).getTime(),
      ),
    [memories],
  );

  const canExportPdf = can("pdf_album", subscription);

  const exportPDF = async () => {
    if (!canExportPdf) {
      navigate("/subscription");
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(245, 230, 211);
    pdf.rect(0, 0, w, h, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(80, 50, 40);
    pdf.text("Notre Album", w / 2, h / 3, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(
      profile?.coupleName || "Notre duo",
      w / 2,
      h / 3 + 12,
      { align: "center" },
    );
    pdf.setFontSize(10);
    pdf.text(
      `${sortedMemories.length} souvenirs`,
      w / 2,
      h / 3 + 22,
      { align: "center" },
    );

    for (const memory of sortedMemories) {
      pdf.addPage();
      const challenge = challenges.find(
        (c) => c.id === memory.challengeId,
      );

      pdf.setFillColor(245, 230, 211);
      pdf.rect(0, 0, w, h, "F");

      let yPos = 15;

      const photo = memory.photos[0]?.url;
      if (photo) {
        try {
          pdf.addImage(photo, "JPEG", 15, yPos, w - 30, 80);
          yPos += 88;
        } catch {
          yPos += 5;
        }
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(80, 50, 40);
      pdf.text(
        `${challenge?.emoji || ""} ${challenge?.title || ""}`,
        w / 2,
        yPos,
        { align: "center", maxWidth: w - 30 },
      );
      yPos += 12;

      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
      pdf.setTextColor(120, 100, 80);
      const dateStr = new Date(memory.date).toLocaleDateString(
        "fr-FR",
        { day: "numeric", month: "long", year: "numeric" },
      );
      pdf.text(
        `${dateStr}${memory.location ? ` — ${memory.location}` : ""}`,
        w / 2,
        yPos,
        { align: "center" },
      );
      yPos += 10;

      if (memory.description) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(60, 40, 30);
        const lines = pdf.splitTextToSize(memory.description, w - 30);
        pdf.text(lines, 15, yPos);
        yPos += lines.length * 5 + 5;
      }

      pdf.setFontSize(12);
      pdf.text("♥".repeat(memory.emotionRating), w / 2, yPos, {
        align: "center",
      });
    }

    pdf.save(`album-${profile?.coupleName || "souvenirs"}.pdf`);
  };

  if (sortedMemories.length === 0) {
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

  const current = sortedMemories[currentPage];
  const challenge = challenges.find(
    (c) => c.id === current?.challengeId,
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-6 pt-8">
        <h1 className="mb-2 text-center font-display text-2xl font-bold">
          Mon Album
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {sortedMemories.length} souvenir
          {sortedMemories.length > 1 ? "s" : ""}
        </p>

        <Card className="mb-6 overflow-hidden border-none shadow-lg">
          <div className="flex min-h-[420px] flex-col bg-accent/30">
            {current?.photos[0]?.url ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={current.photos[0].url}
                  alt={challenge?.title ?? "Souvenir"}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center bg-secondary">
                <span className="text-6xl">{challenge?.emoji}</span>
              </div>
            )}

            <CardContent className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  {new Date(current.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {current.location && ` — ${current.location}`}
                </p>
                <h2 className="mb-3 font-display text-lg font-bold">
                  {challenge?.emoji} {challenge?.title}
                </h2>
                {current.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-1">
                {Array.from({ length: current.emotionRating }).map(
                  (_, index) => (
                    <Heart
                      key={index}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ),
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} / {sortedMemories.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(sortedMemories.length - 1, page + 1),
              )
            }
            disabled={currentPage === sortedMemories.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={exportPDF}
          size="lg"
          className="mb-3 w-full rounded-full text-lg font-handwritten"
        >
          <Download className="mr-2 h-5 w-5" />
          Télécharger en PDF
          {!canExportPdf && <Crown className="ml-2 h-4 w-4" />}
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
