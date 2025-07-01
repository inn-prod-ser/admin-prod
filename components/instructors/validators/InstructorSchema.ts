import { z } from 'zod';


const fullNameValidation = z.string().min( 1, {
  message: 'El nombre completo es obligatorio.',
} );

const profilePictureUrlValidation = z.string().url( {
  message: 'La URL de la imagen de perfil debe ser válida.',
} );

const profesionalTitleValidation = z.string().min( 1, {
  message: 'El título profesional es obligatorio.',
} );

export const courseInstructorSchema = z.object( {
  fullName:            fullNameValidation,
  profilePictureUrl:   profilePictureUrlValidation,
  profesionalTitle:    profesionalTitleValidation,
} );

export interface CourseInstructorInputs extends z.infer<typeof courseInstructorSchema> { }
