"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";


import { CourseInstructorInputs, courseInstructorSchema, UI } from "@/components";
import { Icons } from "@/components/shared/ui";
import { useInstructorsFormHelper } from '../helpers';
import { useGetCourseInstructor } from '../hooks';

interface Props {
  id?: string;
  onClose: () => void;
}

export const InstructorForm = ( { id, onClose }: Props ) => {
  const form = useForm<CourseInstructorInputs>( {
    defaultValues: { fullName: "", profilePictureUrl: "", profesionalTitle: "" },
    mode: "onSubmit",
    resolver: zodResolver( courseInstructorSchema ),
  } );

  const { handleSave, validateUniqueFullName, existingFullNames } =
    useInstructorsFormHelper( id, form );
  const { courseInstructor } = useGetCourseInstructor( id || "" );

  useEffect( () => {
    if ( id && courseInstructor ) {
      form.reset( {
        fullName: courseInstructor.fullName,
        profilePictureUrl: courseInstructor.profilePictureUrl,
        profesionalTitle: courseInstructor.profesionalTitle,
      } );
    }
  }, [ id, courseInstructor, form ] );

  const onSubmit = async ( data: CourseInstructorInputs ) => {
    try {
      await handleSave(
        {
          fullName: data.fullName,
          profilePictureUrl: data.profilePictureUrl,
          profesionalTitle: data.profesionalTitle,
        },
        onClose,
      );

      addToast( {
        title: "Éxito",
        description: id
          ? `El instructor "${ data.fullName }" se ha actualizado correctamente.`
          : `El instructor "${ data.fullName }" se ha creado correctamente.`,
        color: "success",
      } );
    } catch ( error ) {
      addToast( {
        title: "Error",
        description: `Hubo un problema al guardar el instructor "${ data.fullName }".`,
        color: "danger",
      } );
    }
  };

  return (
    <UI.Form id="instructor-form" onSubmit={ form.handleSubmit( onSubmit ) }>
      <Controller
        control={ form.control }
        name="fullName"
        render={ ( { field } ) => (
          <UI.Input
            { ...field }
            errorMessage={
              form.formState.errors.fullName?.message ||
              ( existingFullNames.includes( field.value.toLowerCase() )
                ? "Este instructor ya existe."
                : undefined )
            }
            isInvalid={
              Boolean( form.formState.errors.fullName ) ||
              existingFullNames.includes( field.value.toLowerCase() )
            }
            label="Nombre completo"
            labelPlacement="outside"
            placeholder="Ingresa el nombre completo"
            onValueChange={ ( value ) => {
              field.onChange( value );
              validateUniqueFullName( value );
            } }
          />
        ) }
      />

      <Controller
        control={ form.control }
        name="profesionalTitle"
        render={ ( { field } ) => (
          <UI.Input
            { ...field }
            errorMessage={ form.formState.errors.profesionalTitle?.message }
            isInvalid={ Boolean( form.formState.errors.profesionalTitle ) }
            label="Título profesional"
            labelPlacement="outside"
            placeholder="Ingresa el título profesional"
            onValueChange={ field.onChange }
          />
        ) }
      />

      <Controller
        control={ form.control }
        name="profilePictureUrl"
        render={ ( { field } ) => (
          <UI.Input
            { ...field }
            errorMessage={ form.formState.errors.profilePictureUrl?.message }
            isInvalid={ Boolean( form.formState.errors.profilePictureUrl ) }
            label="URL de la imagen de perfil"
            labelPlacement="outside"
            placeholder="Ingresa la URL de la imagen"
            onValueChange={ field.onChange }
          />
        ) }
      />
    </UI.Form>
  );
};
