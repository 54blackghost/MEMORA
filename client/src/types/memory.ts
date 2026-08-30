export interface MemoryPhoto {
  id?: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface Memory {
  id?: string;
  challengeId: number;

  date: string;
  location?: string;
  description?: string;

  emotionRating: number;

  photos: MemoryPhoto[];

  completedAt: string;
}