import { z } from "zod";

export const memorySchema = z.object({
  date: z.string().min(
    1,
    "La date est obligatoire"
  ),

  location: z
    .string()
    .max(
      200,
      "Le lieu ne peut pas dépasser 200 caractères"
    )
    .optional(),

  description: z
    .string()
    .max(
      2000,
      "La description ne peut pas dépasser 2000 caractères"
    )
    .optional(),

  emotionRating: z
    .number()
    .int()
    .min(1)
    .max(5),
});

export type MemoryFormValues =
  z.infer<typeof memorySchema>;