'use client';

import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Icons } from '@/components/shared/ui';
import { UI } from '@/components/shared';
import { useClassContentFormHelper } from '../helpers';
import { useDeleteClassContent, useGetClassContentByClassId } from '../hooks';
import { ClassContentInputs, classContentSchema } from '../validators';
import { RichTextEditor } from './RichTextEditor';



interface Props {
  idClass: string;
}

export const CourseClassContentTextForm = ( { idClass }: Props ) => {

  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ selectedClassContentIdForForm, setSelectedClassContentIdForForm ] = useState<string | undefined>( undefined );
  const [ classContentIdToDelete, setClassContentIdToDelete ] = useState<string | undefined>( undefined );

  const createEditModalDisclosure = UI.useDisclosure();
  const deleteModalDisclosure = UI.useDisclosure();

  const { classContents, refetch: refetchClassContents, isLoading: isLoadingClassContents } = useGetClassContentByClassId( idClass );
  const { deleteClassContentById, isPending: isDeleting } = useDeleteClassContent();

  const textContent = classContents?.find( c => c.contentType === "text" );
  const hasExistingText = !!textContent;

  const form = useForm<ClassContentInputs>( {
    defaultValues: {
      content: "",
      contentType: "text",
      courseClassId: idClass,
    },
    mode: "onSubmit",
    resolver: zodResolver( classContentSchema ),
  } );

  const { handleSave } = useClassContentFormHelper( selectedClassContentIdForForm, form, idClass );

  useEffect( () => {
    if ( !createEditModalDisclosure.isOpen ) {
      setSelectedClassContentIdForForm( undefined );
    }
  }, [ createEditModalDisclosure.isOpen ] );

  const handleOpenCreateModal = () => {
    setSelectedClassContentIdForForm( undefined );
    form.reset( {
      content: "",
      contentType: "text",
      courseClassId: idClass,
    } );
    createEditModalDisclosure.onOpen();
  };

  const handleOpenEditModal = ( contentId: string ) => {
    const contentToEdit = classContents?.find( c => c.id === contentId );
    if ( contentToEdit ) {
      form.reset( {
        content: contentToEdit.content,
        contentType: contentToEdit.contentType as "text" | "slides" | "video",
        courseClassId: contentToEdit.courseClass.id,
      } );
      setSelectedClassContentIdForForm( contentId );
      createEditModalDisclosure.onOpen();
    }
  };

  const handleOpenDeleteModal = ( contentId: string ) => {
    setClassContentIdToDelete( contentId );
    deleteModalDisclosure.onOpen();
  };

  const handleConfirmDelete = async () => {
    if ( classContentIdToDelete ) {
      try {
        await deleteClassContentById( classContentIdToDelete );
        addToast( {
          title: "Éxito",
          description: "El contenido de texto se ha eliminado correctamente.",
          color: "success",
        } );
        refetchClassContents();
      } catch ( error ) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        addToast( {
          title: "Error",
          description: "No se pudo eliminar el contenido.",
          color: "danger",
        } );
      } finally {
        deleteModalDisclosure.onClose();
        setClassContentIdToDelete( undefined );
      }
    }
  };

  const onSubmit = async ( data: ClassContentInputs ) => {
    setIsSubmitting( true );
    try {
      await handleSave( data, () => {
        createEditModalDisclosure.onClose();
        refetchClassContents();
      } );
      addToast( {
        title: "Éxito",
        description: selectedClassContentIdForForm
          ? `El contenido de texto se ha actualizado correctamente.`
          : `El contenido de texto se ha creado correctamente.`,
        color: "success",
      } );
    } catch ( error ) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      addToast( {
        title: "Error",
        description: `No se pudo ${ selectedClassContentIdForForm ? "actualizar" : "crear" } el contenido de texto. Verifique su conexión al servidor.`,
        color: "danger",
      } );
    } finally {
      setIsSubmitting( false );
    }
  };

  return (
    <div className="space-y-4">

      { !isLoadingClassContents && !hasExistingText && (
        <UI.Button
          size="md"
          startContent={ <Icons.IoAddOutline size={ 24 } /> }
          variant="ghost"
          onPress={ handleOpenCreateModal }
        >
          Nuevo texto
        </UI.Button>
      ) }

      { isLoadingClassContents && (
        <p className="text-sm text-gray-500 py-4 text-center">Cargando contenido...</p>
      ) }

      { !isLoadingClassContents && hasExistingText && textContent && (
        <div className="flex flex-col gap-2">
          <div
            className="prose max-w-none bg-gray-50 border border-gray-200 rounded-md p-4"
            dangerouslySetInnerHTML={ { __html: textContent.content } }
          />

          <div className="flex items-center justify-end space-x-2">
            <UI.Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={ () => handleOpenEditModal( textContent.id ) }
              aria-label="Editar texto"
            >
              <Icons.IoPencilOutline size={ 20 } />
            </UI.Button>
            <UI.Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={ () => handleOpenDeleteModal( textContent.id ) }
              aria-label="Eliminar texto"
            >
              <Icons.IoTrashOutline size={ 20 } />
            </UI.Button>
          </div>
        </div>
      ) }

      { !isLoadingClassContents && !hasExistingText && (
        <p className="text-sm text-gray-500 py-4 text-center">No hay contenido de texto asignado a esta clase.</p>
      ) }

      <UI.Modal
        backdrop="blur"
        isDismissable={ false }
        isOpen={ createEditModalDisclosure.isOpen }
        onOpenChange={ createEditModalDisclosure.onOpenChange }
      >
        <UI.ModalContent>
          <>
            <UI.ModalHeader className="flex flex-row gap-1 justify-center items-center">
              { selectedClassContentIdForForm ? (
                <>
                  <Icons.IoPencilOutline size={ 24 } /> Editar texto
                </>
              ) : (
                <>
                  <Icons.IoAddOutline size={ 24 } /> Crear texto
                </>
              ) }
            </UI.ModalHeader>

            <UI.ModalBody>
              <UI.Form id="class-content-text-form" onSubmit={ form.handleSubmit( onSubmit ) }>
                <Controller
                  control={ form.control }
                  name="content"
                  render={ ( { field } ) => (
                    <RichTextEditor
                      value={ field.value }
                      onChange={ field.onChange }
                      errorMessage={ form.formState.errors.content?.message }
                      isInvalid={ Boolean( form.formState.errors.content ) }
                      label="Texto de la clase"
                      placeholder="Agrega el contenido de texto en formato enriquecido..."
                    />
                  ) }
                />
              </UI.Form>
            </UI.ModalBody>

            <UI.ModalFooter className="justify-center flex items-center space-x-3">
              <UI.Button
                color="danger"
                startContent={ <Icons.IoArrowBackOutline size={ 24 } /> }
                variant="light"
                onPress={ () => {
                  createEditModalDisclosure.onClose();
                } }
              >
                Cerrar
              </UI.Button>

              <UI.Button
                color="secondary"
                form="class-content-text-form"
                isLoading={ isSubmitting }
                startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                type="submit"
              >
                Guardar
              </UI.Button>
            </UI.ModalFooter>
          </>
        </UI.ModalContent>
      </UI.Modal>

      <UI.Modal
        backdrop="blur"
        isOpen={ deleteModalDisclosure.isOpen }
        onOpenChange={ deleteModalDisclosure.onOpenChange }
      >
        <UI.ModalContent>
          <UI.ModalHeader className="flex flex-col gap-1">
            Confirmar eliminación
          </UI.ModalHeader>
          <UI.ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.
            </p>
          </UI.ModalBody>
          <UI.ModalFooter>
            <UI.Button
              variant="light"
              onPress={ deleteModalDisclosure.onClose }
            >
              Cancelar
            </UI.Button>
            <UI.Button
              color="danger"
              isLoading={ isDeleting }
              onPress={ handleConfirmDelete }
            >
              Eliminar
            </UI.Button>
          </UI.ModalFooter>
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};
