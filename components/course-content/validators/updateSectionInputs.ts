import { z } from "zod";

export const updateSectionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .optional(),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" })
    .optional(),
  slug: z
    .string()
    .min(3, { message: "El slug debe tener al menos 3 caracteres" })
    .optional(),
  courseId: z
    .string()
    .uuid({ message: "El ID del curso debe ser un UUID válido" })
    .optional(),
  positionOrder: z.number().int().optional(),
});

export type UpdateSectionInputs = z.infer<typeof updateSectionSchema>;
