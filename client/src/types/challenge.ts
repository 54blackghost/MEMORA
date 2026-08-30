export type ChallengeCategory =
  | "romantique"
  | "aventure"
  | "complicité"
  | "créativité"
  | "découverte"
  | "bien-être"
  | "souvenirs";

export type ChallengeAccess = "free" | "premium";

export interface Challenge {
  id: number;
  title: string;
  category: ChallengeCategory;
  emoji: string;
  access: ChallengeAccess;
  isActive: boolean;
}