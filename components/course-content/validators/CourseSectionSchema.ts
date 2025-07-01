import { z } from "zod";

const titleValidation = z
  .string()
  .min(1, {
    message: "El título de la sección es obligatorio.",
  })
  .max(100, {
    message: "El título no puede exceder los 100 caracteres.",
  });

const descriptionValidation = z
  .string()
  .min(1, {
    message: "La descripción de la sección es obligatoria.",
  })
  .max(500, {
    message: "La descripción no puede exceder los 500 caracteres.",
  });

const slugValidation = z
  .string()
  .min(1, {
    message: "El slug es obligatorio.",
  })
  .max(100, {
    message: "El slug no puede exceder los 100 caracteres.",
  })
  .regex(/^[a-z0-9\-]+$/, {
    message:
      "El slug solo puede contener letras minúsculas, números y guiones.",
  });

const courseIdValidation = z.string().uuid({
  message: "El ID del curso debe ser un UUID válido.",
});

const orderValidation = z
  .number()
  .int({
    message: "El orden debe ser un número entero.",
  })
  .min(0, {
    message: "El orden debe ser un número positivo o cero.",
  })
  .optional();

const isPublishedValidation = z
  .boolean({
    invalid_type_error: "El estado de publicación debe ser verdadero o falso.",
  })
  .optional()
  .default(false);

const durationValidation = z
  .number()
  .positive({
    message: "La duración debe ser un número positivo.",
  })
  .optional();

const resourcesValidation = z
  .array(
    z.object({
      type: z.enum(["PDF", "VIDEO", "LINK", "IMAGE"], {
        errorMap: () => ({
          message: "El tipo de recurso debe ser PDF, VIDEO, LINK o IMAGE.",
        }),
      }),
      url: z.string().url({
        message: "La URL del recurso debe ser válida.",
      }),
      title: z.string().min(1, {
        message: "El título del recurso es obligatorio.",
      }),
      duration: z
        .number()
        .positive({
          message: "La duración del recurso debe ser un número positivo.",
        })
        .optional(),
    }),
  )
  .optional()
  .default([]);

export const sectionSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  slug: slugValidation,
  courseId: courseIdValidation,
  order: orderValidation,
  isPublished: isPublishedValidation,
  duration: durationValidation,
  resources: resourcesValidation,
});

export interface SectionInputs extends z.infer<typeof sectionSchema> {}

export const createSectionSchema = sectionSchema.omit({
  order: true,
  isPublished: true,
  resources: true,
});

export const updateSectionSchema = z.object({
  title: titleValidation.optional(),
  description: descriptionValidation.optional(),
  slug: slugValidation.optional(),
  courseId: courseIdValidation,
});

export interface CreateSectionInputs
  extends z.infer<typeof createSectionSchema> {}
export interface UpdateSectionInputs
  extends z.infer<typeof updateSectionSchema> {}
