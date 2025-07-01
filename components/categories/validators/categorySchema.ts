import { z } from "zod";

const titleValidation = z.string().min(1, {
  message: "El título es obligatorio.",
});

export const categorySchema = z.object({
  title: titleValidation,
  visible: z.boolean().optional(),
});

export interface CategoryInputs extends z.infer<typeof categorySchema> {}
