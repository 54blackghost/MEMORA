export type PlanId =
  | "free"
  | "premium"
  | "couple_plus";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired";

export type Feature =
  | "basic_challenges"
  | "premium_challenges"
  | "photo_upload"
  | "multiple_photos"
  | "pdf_album"
  | "printed_album"
  | "ai_memories"
  | "advanced_statistics"
  | "couple_customization";

export interface PlanLimits {
  maxMemories: number | null;
  maxPhotosPerMemory: number;
  maxStorageMb: number | null;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;

  priceMonthly: number;
  priceYearly?: number;

  features: Feature[];
  limits: PlanLimits;
}

export interface Subscription {
  plan: PlanId;
  status: SubscriptionStatus;

  startedAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;

  cancelAtPeriodEnd?: boolean;
}