import type { Plan } from "@/types/subscription";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Découvrir MEMORA et commencer à créer des souvenirs.",
    priceMonthly: 0,

    features: [
      "basic_challenges",
      "photo_upload",
    ],

    limits: {
      maxMemories: 10,
      maxPhotosPerMemory: 1,
      maxStorageMb: 100,
    },
  },

  {
    id: "premium",
    name: "Premium",
    description: "Pour les couples qui veulent aller plus loin.",
    priceMonthly: 4.99,

    features: [
      "basic_challenges",
      "premium_challenges",
      "photo_upload",
      "multiple_photos",
      "pdf_album",
      "advanced_statistics",
    ],

    limits: {
      maxMemories: null,
      maxPhotosPerMemory: 10,
      maxStorageMb: 5000,
    },
  },

  {
    id: "couple_plus",
    name: "Couple+",
    description: "L'expérience MEMORA complète.",
    priceMonthly: 9.99,

    features: [
      "basic_challenges",
      "premium_challenges",
      "photo_upload",
      "multiple_photos",
      "pdf_album",
      "printed_album",
      "ai_memories",
      "advanced_statistics",
      "couple_customization",
    ],

    limits: {
      maxMemories: null,
      maxPhotosPerMemory: 20,
      maxStorageMb: 20000,
    },
  },
];