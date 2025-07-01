"use client";

import { useState, useEffect } from "react";

import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

import { ClassInputs } from "../validators";
import { useAddClass, useGetClass, useUpdateClass } from "../hooks";
import { addToast } from "@heroui/react";

interface Props {
  isOpen: boolean;
  courseSectionId: string;
  classId?: string;
  onClose: () => void;
}

export const ClassFormModal = ( {
  isOpen,
  courseSectionId,
  classId,
  onClose,
}: Props ) => {
  const { addClass, isPending: isAddPending, isError: isAddError } = useAddClass();
  const { updateCourseClass, isPending: isUpdatePending, isError: isUpdateError } = useUpdateClass();
  const { courseClass, isLoading } = useGetClass( classId || "" );

  const [ title, setTitle ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ errors, setErrors ] = useState<{
    title?: string;
    description?: string;
  }>( {} );

  const isPending = isAddPending || isUpdatePending || isLoading;

  
  useEffect( () => {
    if ( classId && courseClass ) {
      setTitle( courseClass.title || "" );
      setDescription( courseClass.description || "" );
    } else if ( !classId ) {
      setTitle( "" );
      setDescription( "" );
    }
  }, [ classId, courseClass ] );

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();

    if ( isSubmitting ) return;

    const newErrors: {
      title?: string;
      description?: string;
    } = {};

    if ( !title ) newErrors.title = "El título es obligatorio";
    if ( !description ) newErrors.description = "La descripción es obligatoria";

    if ( Object.keys( newErrors ).length > 0 ) {
      setErrors( newErrors );
      return;
    }

    setIsSubmitting( true );

    try {
      const data: ClassInputs = {
        courseSectionId,
        title,
        description,
      };

      if ( classId ) {
        await updateCourseClass( classId, data );
        addToast( {
          title: "Éxito",
          description: `La clase "${ title }" se ha actualizado correctamente.`,
          color: "success",
        } );
      } else {
        await addClass( data );
        addToast( {
          title: "Éxito",
          description: `La clase "${ title }" se ha creado correctamente.`,
          color: "success",
        } );
      }

      setTitle( "" );
      setDescription( "" );
      onClose();
    } catch ( error ) {
      addToast( {
        title: "Error",
        description: `Hubo un problema al guardar la clase.`,
        color: "danger",
      } );
    } finally {
      setIsSubmitting( false );
    }
  };

  const handleTitleChange = ( value: string ) => {
    setTitle( value );
    if ( errors.title ) {
      setErrors( ( prev ) => ( { ...prev, title: undefined } ) );
    }
  };

  const handleDescriptionChange = ( value: string ) => {
    setDescription( value );
    if ( errors.description ) {
      setErrors( ( prev ) => ( { ...prev, description: undefined } ) );
    }
  };

  return (
    <UI.Modal isOpen={ isOpen } onOpenChange={ onClose }>
      <UI.ModalContent>
        { ( onCloseModal ) => (
          <>
            <UI.ModalHeader className="flex flex-row justify-center space-x-2">
              { classId ? (
                <>
                  <Icons.IoPencilOutline size={ 24 } />
                  <h3 className="text-lg font-semibold">Editar clase</h3>
                </>
              ) : (
                <>
                  <Icons.IoAddOutline size={ 24 } />
                  <h3 className="text-lg font-semibold">Crear clase</h3>
                </>
              ) }
            </UI.ModalHeader>

            <UI.ModalBody>
              <form id="class-form" onSubmit={ handleSubmit }>
                <div className="space-y-8 w-full">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <UI.Input
                      fullWidth
                      classNames={ {
                        base: "w-full",
                        inputWrapper: "w-full",
                      } }
                      errorMessage={ errors.title }
                      isDisabled={ isPending }
                      isInvalid={ !!errors.title }
                      placeholder="Ingresa un título"
                      value={ title }
                      onChange={ ( e ) => handleTitleChange( e.target.value ) }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <UI.Textarea
                      fullWidth
                      classNames={ {
                        base: "w-full",
                        inputWrapper: "w-full",
                      } }
                      errorMessage={ errors.description }
                      isDisabled={ isPending }
                      isInvalid={ !!errors.description }
                      minRows={ 3 }
                      placeholder="Ingresa una descripción"
                      value={ description }
                      onChange={ ( e ) => handleDescriptionChange( e.target.value ) }
                    />
                  </div>
                </div>
              </form>
            </UI.ModalBody>

            <UI.ModalFooter className="flex flex-row justify-center space-x-2">
              <UI.Button
                color="danger"
                isDisabled={ isSubmitting }
                startContent={ <Icons.IoArrowBackOutline size={ 20 } /> }
                variant="light"
                onPress={ onCloseModal }
              >
                Cancelar
              </UI.Button>
              <UI.Button
                color="primary"
                form="class-form"
                isLoading={ isSubmitting }
                startContent={
                  !isSubmitting ? <Icons.IoSaveOutline size={ 20 } /> : null
                }
                type="submit"
              >
                { isSubmitting ? "Guardando..." : "Guardar" }
              </UI.Button>
            </UI.ModalFooter>
          </>
        ) }
      </UI.ModalContent>
    </UI.Modal>
  );
};