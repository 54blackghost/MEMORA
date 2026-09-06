import jsPDF from "jspdf";
import type { Memory } from "@/types/memory";
import type { Profile } from "@/types/profile";
import { challenges } from "@/data/challenges";

export interface AlbumPdfOptions {
  memories: Memory[];
  profile: Profile | null;
  title?: string;
  maxPhotosPerMemory?: number;
}

function safeFileName(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-") || "souvenirs";
}

function imageFormat(source: string): "JPEG" | "PNG" | "WEBP" {
  const match = source.match(/^data:image\/(jpeg|jpg|png|webp)/i);
  if (!match) return "JPEG";
  return match[1].toLowerCase() === "png" ? "PNG" : match[1].toLowerCase() === "webp" ? "WEBP" : "JPEG";
}

function addContainedImage(pdf: jsPDF, source: string, x: number, y: number, width: number, height: number) {
  try {
    const props = pdf.getImageProperties(source);
    const ratio = props.width / props.height;
    const boxRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    if (ratio > boxRatio) drawHeight = width / ratio;
    else drawWidth = height * ratio;
    pdf.setFillColor(238, 224, 211);
    pdf.roundedRect(x, y, width, height, 3, 3, "F");
    pdf.addImage(source, imageFormat(source), x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } catch {
    pdf.setFillColor(238, 224, 211);
    pdf.roundedRect(x, y, width, height, 3, 3, "F");
  }
}

export function generateAlbumPdf({ memories, profile, title = "NOTRE ALBUM", maxPhotosPerMemory = 3 }: AlbumPdfOptions): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const sorted = [...memories].sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
  const coupleName = profile?.coupleName || "Notre duo";
  const bg = [250, 242, 236] as const;
  const ink = [72, 48, 40] as const;
  const muted = [139, 108, 94] as const;
  const accent = [198, 94, 113] as const;
  const border = [226, 198, 184] as const;

  pdf.setFillColor(...bg); pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setDrawColor(...border); pdf.setLineWidth(0.6);
  pdf.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 5, 5, "S");
  const cover = sorted[0]?.photos?.[0]?.url;
  if (cover) addContainedImage(pdf, cover, margin + 10, 27, contentWidth - 20, 68);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...accent); pdf.text("MEMORA", pageWidth / 2, 111, { align: "center" });
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(24); pdf.setTextColor(...ink); pdf.text(title, pageWidth / 2, 125, { align: "center" });
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(14); pdf.setTextColor(...muted); pdf.text(pdf.splitTextToSize(coupleName, contentWidth - 24).slice(0, 2), pageWidth / 2, 146, { align: "center" });
  pdf.setFontSize(8.5); pdf.text(`${sorted.length} souvenir${sorted.length > 1 ? "s" : ""}`, pageWidth / 2, 160, { align: "center" });

  sorted.forEach((memory, index) => {
    pdf.addPage(); pdf.setFillColor(...bg); pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(...accent); pdf.text(`SOUVENIR ${String(index + 1).padStart(2, "0")}`, margin, 12);
    pdf.setDrawColor(...border); pdf.setLineWidth(0.25); pdf.line(margin, 15, pageWidth - margin, 15);
    let y = 22;
    const photos = memory.photos.map((p) => p.url).filter(Boolean).slice(0, Math.max(1, maxPhotosPerMemory));
    if (photos.length === 1) addContainedImage(pdf, photos[0], margin, y, contentWidth, 82);
    else if (photos.length > 1) {
      const gap = 4; const w = (contentWidth - gap) / 2;
      addContainedImage(pdf, photos[0], margin, y, w, 74);
      addContainedImage(pdf, photos[1], margin + w + gap, y, w, 74);
      if (photos[2]) addContainedImage(pdf, photos[2], margin, y + 78, contentWidth, 50);
    } else {
      pdf.setFillColor(238, 221, 211); pdf.roundedRect(margin, y, contentWidth, 55, 4, 4, "F");
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...muted); pdf.text("Souvenir sans photo", pageWidth / 2, y + 29, { align: "center" });
    }
    y += photos.length > 2 ? 136 : photos.length > 0 ? 91 : 64;
    const challenge = challenges.find((c) => c.id === memory.challengeId);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(14); pdf.setTextColor(...ink);
    pdf.text(pdf.splitTextToSize(challenge?.title || "Notre souvenir", contentWidth - 18).slice(0, 3), pageWidth / 2, y, { align: "center" });
    y += 20;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...muted);
    const date = new Date(memory.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    pdf.text(memory.location ? `${date} · ${memory.location}` : date, pageWidth / 2, y, { align: "center" });
    y += 9;
    if (memory.description) {
      pdf.setFontSize(9); pdf.setTextColor(...ink); pdf.text(pdf.splitTextToSize(memory.description, contentWidth - 20).slice(0, 6), margin + 10, y);
    }
    pdf.setFontSize(6.5); pdf.setTextColor(...muted); pdf.text(`MEMORA   ${index + 2} / ${sorted.length + 1}`, margin, pageHeight - 8);
  });
  pdf.save(`album-${safeFileName(coupleName)}.pdf`);
}
