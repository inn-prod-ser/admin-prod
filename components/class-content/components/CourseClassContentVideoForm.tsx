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


interface Props {
  idClass: string;
}

export const CourseClassContentVideoForm = ( { idClass }: Props ) => {

  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ selectedClassContentIdForForm, setSelectedClassContentIdForForm ] = useState<string | undefined>( undefined );
  const [ classContentIdToDelete, setClassContentIdToDelete ] = useState<string | undefined>( undefined );

  const createEditModalDisclosure = UI.useDisclosure();
  const deleteModalDisclosure = UI.useDisclosure();

  const { classContents, refetch: refetchClassContents, isLoading: isLoadingClassContents } = useGetClassContentByClassId( idClass );
  const { deleteClassContentById, isPending: isDeleting } = useDeleteClassContent();


  const form = useForm<ClassContentInputs>( {
    defaultValues: {
      content: "",
      contentType: "video",
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
      contentType: "video",
      courseClassId: idClass,
    } );
    createEditModalDisclosure.onOpen();
  };

  const handleOpenEditModal = ( contentId: string ) => {
    const contentToEdit = classContents?.find( c => c.id === contentId );
    if ( contentToEdit ) {
      form.reset( {
        content: contentToEdit.content,
        contentType: contentToEdit.contentType as "video" | "slides" | "text",
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
          description: "El video se ha eliminado correctamente.",
          color: "success",
        } );
        refetchClassContents();
      } catch ( error ) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        console.error( `Error al eliminar el video:`, errorMessage );
        addToast( {
          title: "Error",
          description: "No se pudo eliminar el video.",
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
          ? `El video se ha actualizado correctamente.`
          : `El video se ha creado correctamente.`,
        color: "success",
      } );
    } catch ( error ) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error( `Error al guardar el video:`, errorMessage );
      addToast( {
        title: "Error",
        description: `No se pudo ${ selectedClassContentIdForForm ? "actualizar" : "crear" } el video. Verifique su conexión al servidor.`,
        color: "danger",
      } );
    } finally {
      setIsSubmitting( false );
    }
  };

  const videoItems = classContents?.filter( cc => cc.contentType === 'video' );
  const hasExistingVideos = videoItems && videoItems.length > 0;

  return (
    <div className="space-y-4">

      { !isLoadingClassContents && !hasExistingVideos && (
        <UI.Button
          size="md"
          startContent={ <Icons.IoAddOutline size={ 24 } /> }
          variant="ghost"
          onPress={ handleOpenCreateModal }
        >
          Nuevo video
        </UI.Button>
      ) }

      { isLoadingClassContents && (
        <p className="text-sm text-gray-500 py-4 text-center">Cargando videos...</p>
      ) }

      { !isLoadingClassContents && hasExistingVideos && (
        <div className="space-y-3">
          { videoItems?.map( ( classContent ) => (
            <div key={ classContent.id } className="flex items-center justify-end p-2 bg-gray-100 rounded-md shadow-sm">
              <div className="flex items-center space-x-1">
                <UI.Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={ () => handleOpenEditModal( classContent.id ) }
                  aria-label="Editar video"
                >
                  <Icons.IoPencilOutline size={ 20 } />
                </UI.Button>
                <UI.Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={ () => handleOpenDeleteModal( classContent.id ) }
                  aria-label="Eliminar video"
                >
                  <Icons.IoTrashOutline size={ 20 } />
                </UI.Button>
              </div>
            </div>
          )
          ) }
        </div>
      ) }


      { !isLoadingClassContents && !hasExistingVideos && (
        <p className="text-sm text-gray-500 py-4 text-center">No hay videos asignados a esta clase.</p>
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
                  <Icons.IoPencilOutline size={ 24 } /> Editar video
                </>
              ) : (
                <>
                  <Icons.IoAddOutline size={ 24 } /> Crear video
                </>
              ) }
            </UI.ModalHeader>

            <UI.ModalBody>
              <UI.Form id="class-content-video-form" onSubmit={ form.handleSubmit( onSubmit ) }>
                <Controller
                  control={ form.control }
                  name="content"
                  render={ ( { field } ) => (
                    <UI.Input
                      { ...field }
                      errorMessage={ form.formState.errors.content?.message }
                      isInvalid={ Boolean( form.formState.errors.content ) }
                      label="URL del video"
                      labelPlacement="outside"
                      placeholder="Ingresa el ID del vídeo"
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
                form="class-content-video-form"
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
              ¿Estás seguro de que deseas eliminar este video? Esta acción no se puede deshacer.
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