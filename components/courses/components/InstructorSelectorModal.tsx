"use client";

import { useEffect, useMemo, useState } from "react";

import { ICourseInstructor } from "@/components/instructors/interfaces";
import { useGetCourseInstructors } from "@/components/instructors/hooks";
import { useAddInstructorToCourse, useRemoveInstructorFromCourse, useGetCourseInstructorByCourseId } from "@/components/instructors/hooks";
import { Icons } from "@/components/shared/ui";
import { UI } from "@/components/shared";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export const InstructorSelectorModal = ( {
  isOpen,
  onClose,
  courseId,
}: Props ) => {
  const { instructors = [], isLoading } = useGetCourseInstructors();
  const { courseInstructor: courseInstructors, isFetching } = useGetCourseInstructorByCourseId( courseId );
  const { addToCourse, isPending: isAdding } = useAddInstructorToCourse();
  const { removeFromCourse, isPending: isRemoving } = useRemoveInstructorFromCourse();

  const [ search, setSearch ] = useState( "" );
  const [ selectedIds, setSelectedIds ] = useState<string[]>( [] );

  useEffect( () => {
    if ( Array.isArray( courseInstructors ) ) {
      setSelectedIds( courseInstructors.map( ( ins ) => ins.id ) );
    } else {
      setSelectedIds( [] );
    }
  }, [ courseInstructors, isOpen ] );

  const filteredInstructors = useMemo( () => {
    return instructors.filter(
      ( ins ) =>
        ins.fullName.toLowerCase().includes( search.toLowerCase() ) ||
        ins.profesionalTitle.toLowerCase().includes( search.toLowerCase() )
    );
  }, [ instructors, search ] );

  const isInstructorSelected = ( id: string ) => selectedIds.includes( id );

  const toggleSelect = async ( id: string ) => {
    if ( !courseId ) return;
    if ( isInstructorSelected( id ) ) {
      await removeFromCourse( courseId, id );
      setSelectedIds( ( prev ) => prev.filter( ( sid ) => sid !== id ) );
    } else {
      await addToCourse( courseId, id );
      setSelectedIds( ( prev ) => [ ...prev, id ] );
    }
  };

  return (
    <UI.Modal isOpen={ isOpen } onOpenChange={ onClose } backdrop="blur" size="2xl">
      <UI.ModalContent>
        <UI.ModalHeader className="flex flex-col gap-2">
          <span className="text-lg font-semibold flex items-center gap-2">
            <Icons.IoPeopleOutline size={ 22 } />
            Administrar instructores del curso
          </span>
          <UI.Input
            autoFocus
            placeholder="Buscar por nombre o título"
            value={ search }
            onValueChange={ setSearch }
            startContent={ <Icons.IoSearchOutline /> }
          />
        </UI.ModalHeader>
        <UI.ModalBody>
          <div className="overflow-y-auto max-h-[300px] divide-y divide-default-100">
            { isLoading || isFetching ? (
              <div className="py-12 text-center">Cargando instructores...</div>
            ) : filteredInstructors.length === 0 ? (
              <div className="py-12 text-center text-default-400">
                No se encontraron instructores
              </div>
            ) : (
              filteredInstructors.map( ( ins ) => (
                <div
                  key={ ins.id }
                  className={ `flex items-center py-2 px-2 cursor-pointer gap-3 hover:bg-default-100 rounded-lg transition ${ isInstructorSelected( ins.id ) ? "bg-primary-50" : ""
                    }` }
                  onClick={ () => toggleSelect( ins.id ) }
                >
                  <input
                    type="checkbox"
                    checked={ isInstructorSelected( ins.id ) }
                    readOnly
                    className="accent-primary-500 w-4 h-4"
                    tabIndex={ -1 }
                  />
                  <img
                    src={ ins.profilePictureUrl }
                    alt={ ins.fullName }
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{ ins.fullName }</span>
                    <span className="text-xs text-default-500">{ ins.profesionalTitle }</span>
                  </div>
                </div>
              ) )
            ) }
          </div>
        </UI.ModalBody>
        <UI.ModalFooter className="justify-end">
          <UI.Button
            color="danger"
            variant="flat"
            startContent={ <Icons.IoArrowBackOutline /> }
            onPress={ onClose }
          >
            Cerrar
          </UI.Button>
        </UI.ModalFooter>
      </UI.ModalContent>
    </UI.Modal>
  );
};
