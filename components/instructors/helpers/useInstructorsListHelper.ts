import { useState } from "react";
import { addToast } from "@heroui/react";

import { useDeleteCourseInstructor, useGetCourseInstructors } from "../hooks";

import { UI } from "@/components/shared";

export const useInstructorsListHelper = () => {
  const { instructors, refetch } = useGetCourseInstructors();
  const { deleteInstructorById, isPending } = useDeleteCourseInstructor();
  const { isOpen, onOpen, onOpenChange } = UI.useDisclosure();

  const [ selectedInstructorId, setSelectedInstructorId ] = useState<
    string | undefined
  >( undefined );
  const [ instructorToDelete, setInstructorToDelete ] = useState<string | undefined>(
    undefined,
  );
  const [ instructorFullName, setInstructorFullName ] = useState<string | undefined>(
    undefined,
  );
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState( false );

  const handleEditInstructor = ( id: string ) => {
    setSelectedInstructorId( id );
    onOpen();
  };

  const handleDeleteInstructor = ( id: string, fullName: string ) => {
    setInstructorToDelete( id );
    setInstructorFullName( fullName );
    setIsDeleteModalOpen( true );
  };

  const onConfirmDelete = async () => {
    if ( !instructorToDelete || !instructorFullName ) return;

    try {
      await deleteInstructorById( instructorToDelete );
      await refetch();

      addToast( {
        title: "Éxito",
        description: `El instructor "${ instructorFullName }" ha sido eliminado correctamente.`,
        color: "success",
      } );

      setIsDeleteModalOpen( false );
      setInstructorToDelete( undefined );
      setInstructorFullName( undefined );
    } catch ( error ) {
      addToast( {
        title: "Error",
        description: `Hubo un problema al eliminar el instructor "${ instructorFullName }".`,
        color: "danger",
      } );
    }
  };

  return {
    instructors,
    handleDeleteInstructor,
    handleEditInstructor,
    isDeleteModalOpen,
    isOpen,
    isPending,
    onConfirmDelete,
    onOpenChange,
    selectedInstructorId,
    setIsDeleteModalOpen,
    instructorFullName,
  };
};
