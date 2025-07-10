import { z } from "zod";

const contentValidation = z.string().min(1, {
  message: "El contenido es obligatorio.",
});

const contentTypeValidation = z.enum(["slides", "video", "text"], {
  invalid_type_error: "El tipo de contenido no es válido.",
  message: "Tipo de contenido inválido.",
});

const courseClassIdValidation = z.string().uuid({
  message: "El ID de la clase debe ser un UUID válido.",
});

export const classContentSchema = z.object({
  content:        contentValidation,
  contentType:    contentTypeValidation,
  courseClassId:  courseClassIdValidation,
});

export interface ClassContentInputs extends z.infer<typeof classContentSchema> {}