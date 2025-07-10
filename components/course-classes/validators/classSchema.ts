import { z } from "zod";

const courseSectionIdValidation = z.string().uuid({
  message: "El ID de la sección del curso debe ser un UUID válido.",
});

const titleValidation = z.string().min(1, {
  message: "El título es obligatorio.",
});

const descriptionValidation = z.string().min(1, {
  message: "La descripción es obligatoria.",
});

export const classSchema = z.object({
  courseSectionId: courseSectionIdValidation,
  title: titleValidation,
  description: descriptionValidation,
});

export interface ClassInputs extends z.infer<typeof classSchema> {}
