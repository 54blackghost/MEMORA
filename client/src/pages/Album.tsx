import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { challenges } from "@/data/challenges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import jsPDF from "jspdf";

const PAGE_MARGIN = 15;
const PHOTO_GAP = 4;
const MAX_DESCRIPTION_LINES = 8;

function safeFileName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-") || "souvenirs";
}

function getImageFormat(dataUrl: string): "JPEG" | "PNG" | "WEBP" {
  const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp)/i);
  if (!match) return "JPEG";

  const type = match[1].toLowerCase();
  if (type === "png") return "PNG";
  if (type === "webp") return "WEBP";
  return "JPEG";
}

function addContainedImage(
  pdf: jsPDF,
  source: string,
  x: number,
  y: number,
  boxWidth: number,
  boxHeight: number,
) {
  try {
    const properties = pdf.getImageProperties(source);
    const imageRatio = properties.width / properties.height;
    const boxRatio = boxWidth / boxHeight;

    let width = boxWidth;
    let height = boxHeight;

    if (imageRatio > boxRatio) {
      height = boxWidth / imageRatio;
    } else {
      width = boxHeight * imageRatio;
    }

    const imageX = x + (boxWidth - width) / 2;
    const imageY = y + (boxHeight - height) / 2;

    pdf.setFillColor(238, 224, 211);
    pdf.roundedRect(x, y, boxWidth, boxHeight, 3, 3, "F");
    pdf.addImage(source, getImageFormat(source), imageX, imageY, width, height);
    return true;
  } catch {
    pdf.setFillColor(238, 224, 211);
    pdf.roundedRect(x, y, boxWidth, boxHeight, 3, 3, "F");
    return false;
  }
}

function drawEmotionRating(pdf: jsPDF, rating: number, x: number, y: number) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const spacing = 5;

  for (let index = 0; index < 5; index += 1) {
    const filled = index < safeRating;
    pdf.setFillColor(filled ? 205 : 225, filled ? 92 : 210, filled ? 112 : 198);
    pdf.circle(x + index * spacing, y, 1.7, filled ? "F" : "S");
  }
}

function drawMemoryPhotos(
  pdf: jsPDF,
  photos: string[],
  x: number,
  y: number,
  width: number,
): number {
  const count = Math.min(photos.length, 3);

  if (count === 1) {
    addContainedImage(pdf, photos[0], x, y, width, 82);
    return y + 82;
  }

  if (count === 2) {
    const photoWidth = (width - PHOTO_GAP) / 2;
    addContainedImage(pdf, photos[0], x, y, photoWidth, 74);
    addContainedImage(
      pdf,
      photos[1],
      x + photoWidth + PHOTO_GAP,
      y,
      photoWidth,
      74,
    );
    return y + 74;
  }

  const largeWidth = width * 0.62;
  const smallWidth = width - largeWidth - PHOTO_GAP;

  addContainedImage(pdf, photos[0], x, y, largeWidth, 90);
  addContainedImage(
    pdf,
    photos[1],
    x + largeWidth + PHOTO_GAP,
    y,
    smallWidth,
    43,
  );
  addContainedImage(
    pdf,
    photos[2],
    x + largeWidth + PHOTO_GAP,
    y + 47,
    smallWidth,
    43,
  );

  return y + 90;
}

const Album = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { profile, memories } = useApp();

  const sortedMemories = useMemo(
    () =>
      [...memories].sort(
        (a, b) =>
          new Date(a.completedAt).getTime() -
          new Date(b.completedAt).getTime(),
      ),
    [memories],
  );

  const exportPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - PAGE_MARGIN * 2;
    const coupleName = profile?.coupleName || "Notre duo";

    const bg = [250, 242, 236] as const;
    const ink = [72, 48, 40] as const;
    const muted = [139, 108, 94] as const;
    const accent = [198, 94, 113] as const;
    const border = [226, 198, 184] as const;
    const card = [255, 250, 246] as const;

    const fillPage = () => {
      pdf.setFillColor(...bg);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
    };

    const drawHeader = (label: string) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(...accent);
      pdf.text(label.toUpperCase(), PAGE_MARGIN, 12);

      pdf.setDrawColor(...border);
      pdf.setLineWidth(0.25);
      pdf.line(PAGE_MARGIN, 15, pageWidth - PAGE_MARGIN, 15);
    };

    const drawFooter = (pageNumber: number, total: number) => {
      pdf.setDrawColor(...border);
      pdf.setLineWidth(0.25);
      pdf.line(PAGE_MARGIN, pageHeight - 14, pageWidth - PAGE_MARGIN, pageHeight - 14);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor(...muted);
      pdf.text("MEMORA", PAGE_MARGIN, pageHeight - 8);
      pdf.text(`${pageNumber} / ${total}`, pageWidth - PAGE_MARGIN, pageHeight - 8, {
        align: "right",
      });
    };

    // COVER
    fillPage();
    pdf.setDrawColor(...border);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(
      PAGE_MARGIN,
      PAGE_MARGIN,
      contentWidth,
      pageHeight - PAGE_MARGIN * 2,
      5,
      5,
      "S",
    );

    const coverPhoto = sortedMemories[0]?.photos?.[0]?.url;
    if (coverPhoto) {
      addContainedImage(
        pdf,
        coverPhoto,
        PAGE_MARGIN + 10,
        27,
        contentWidth - 20,
        68,
      );
    } else {
      pdf.setFillColor(238, 221, 211);
      pdf.roundedRect(PAGE_MARGIN + 10, 27, contentWidth - 20, 68, 4, 4, "F");
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...accent);
    pdf.text("MEMORA", pageWidth / 2, 111, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(...ink);
    pdf.text("NOTRE ALBUM", pageWidth / 2, 125, { align: "center" });

    pdf.setDrawColor(...accent);
    pdf.setLineWidth(0.7);
    pdf.line(pageWidth / 2 - 17, 132, pageWidth / 2 + 17, 132);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(...muted);
    const coverName = pdf.splitTextToSize(coupleName, contentWidth - 24);
    pdf.text(coverName.slice(0, 2), pageWidth / 2, 146, { align: "center" });

    pdf.setFontSize(8.5);
    pdf.setTextColor(...muted);
    pdf.text(
      `${sortedMemories.length} souvenir${sortedMemories.length > 1 ? "s" : ""}`,
      pageWidth / 2,
      160,
      { align: "center" },
    );

    pdf.setFillColor(...accent);
    pdf.circle(pageWidth / 2 - 4, 173, 1.4, "F");
    pdf.circle(pageWidth / 2, 173, 1.4, "F");
    pdf.circle(pageWidth / 2 + 4, 173, 1.4, "F");

    pdf.setFontSize(7.5);
    pdf.setTextColor(...muted);
    pdf.text("Des moments à garder pour toujours", pageWidth / 2, 190, {
      align: "center",
    });

    // MEMORY PAGES
    sortedMemories.forEach((memory, memoryIndex) => {
      pdf.addPage();
      fillPage();
      drawHeader(`Souvenir ${String(memoryIndex + 1).padStart(2, "0")}`);

      const challenge = challenges.find((c) => c.id === memory.challengeId);
      const photos = memory.photos
        .map((photo) => photo.url)
        .filter(Boolean)
        .slice(0, 3);

      let yPos = 22;

      if (photos.length > 0) {
        yPos = drawMemoryPhotos(pdf, photos, PAGE_MARGIN, yPos, contentWidth) + 9;
      } else {
        pdf.setFillColor(238, 221, 211);
        pdf.roundedRect(PAGE_MARGIN, yPos, contentWidth, 55, 4, 4, "F");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text("Souvenir sans photo", pageWidth / 2, yPos + 29, {
          align: "center",
        });
        yPos += 64;
      }

      pdf.setFillColor(...card);
      pdf.roundedRect(PAGE_MARGIN, yPos, contentWidth, 75, 4, 4, "F");
      pdf.setDrawColor(...border);
      pdf.setLineWidth(0.25);
      pdf.roundedRect(PAGE_MARGIN, yPos, contentWidth, 75, 4, 4, "S");

      yPos += 10;

      const title = challenge?.title || "Notre souvenir";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(...ink);
      const titleLines = pdf.splitTextToSize(title, contentWidth - 18).slice(0, 3);
      pdf.text(titleLines, pageWidth / 2, yPos, { align: "center" });
      yPos += titleLines.length * 6 + 5;

      const dateStr = new Date(memory.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const metadata = memory.location
        ? `${dateStr}  ·  ${memory.location}`
        : dateStr;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...muted);
      const metadataLines = pdf.splitTextToSize(metadata, contentWidth - 18).slice(0, 2);
      pdf.text(metadataLines, pageWidth / 2, yPos, { align: "center" });
      yPos += metadataLines.length * 4.5 + 6;

      pdf.setDrawColor(...border);
      pdf.setLineWidth(0.25);
      pdf.line(PAGE_MARGIN + 12, yPos, pageWidth - PAGE_MARGIN - 12, yPos);
      yPos += 7;

      if (memory.description) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...ink);
        const descriptionLines = pdf
          .splitTextToSize(memory.description, contentWidth - 20)
          .slice(0, 4);
        pdf.text(descriptionLines, PAGE_MARGIN + 10, yPos);
        yPos += descriptionLines.length * 4.5 + 5;
      }

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...muted);
      pdf.text("Émotion", PAGE_MARGIN + 10, yPos);
      drawEmotionRating(pdf, memory.emotionRating, PAGE_MARGIN + 34, yPos - 1);
      pdf.text(`${memory.emotionRating}/5`, pageWidth - PAGE_MARGIN - 10, yPos, {
        align: "right",
      });

      drawFooter(memoryIndex + 2, sortedMemories.length + 1);
    });

    pdf.save(`album-${safeFileName(coupleName)}.pdf`);
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
  const challenge = challenges.find((c) => c.id === current?.challengeId);

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
                <span className="text-6xl">📖</span>
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
                  {challenge?.title}
                </h2>
                {current.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-1">
                {Array.from({ length: current.emotionRating }).map((_, index) => (
                  <Heart
                    key={index}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
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
          Télécharger mon album PDF
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
