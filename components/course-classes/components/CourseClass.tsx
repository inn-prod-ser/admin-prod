"use client";

import { useState } from "react";

import { addToast } from "@heroui/react";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

import { useGetClasses, useRemoveClass } from "../hooks";
import { ICourseClassesResponse } from "../interfaces";
import { ClassFormModal } from "./ClassFormModal";
import { DeleteClassModal } from "./DeleteClassModal";
import { ClassItem } from "./ClassItem";
import { useUpdateClassOrder } from "../hooks/useUpdateClassOrder";

interface SortableClassProps {
  classItem: ICourseClassesResponse;
  onEdit: ( id: string ) => void;
  onDelete: ( id: string, title: string ) => void;
  onSelect?: ( id: string ) => void;
  isSelected?: boolean;
}

const SortableClass = ( {
  classItem,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false
}: SortableClassProps ) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable( { id: classItem.id } );

  const style = {
    transform: CSS.Transform.toString( transform ),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = {
    ...listeners,
    ...attributes
  };

  return (
    <div ref={ setNodeRef } style={ style }>
      <ClassItem
        classItem={ classItem }
        onDelete={ onDelete }
        onEdit={ onEdit }
        onSelect={ onSelect }
        isSelected={ isSelected }
        dragHandleProps={ dragHandleProps }
      />
    </div>
  );
};

interface Props {
  sectionid: string;
  onSelectClass?: ( id: string ) => void;
}

export const CourseClass = ( { sectionid, onSelectClass }: Props ) => {
  const {
    courseClasses = [],
    isLoading,
    refetch,
  } = useGetClasses( sectionid );

  const { removeClass, isPending: isDeletePending } = useRemoveClass();
  const { updateOrder, isPending: isUpdateOrderPending } = useUpdateClassOrder();

  const [ isFormModalOpen, setIsFormModalOpen ] = useState( false );
  const [ selectedClassId, setSelectedClassId ] = useState<string | undefined>(
    undefined
  );

  const [ classToDelete, setClassToDelete ] = useState<string | undefined>(
    undefined
  );
  const [ classTitle, setClassTitle ] = useState<string | undefined>( undefined );
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState( false );

  const sensors = useSensors(
    useSensor( PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    } ),
    useSensor( KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    } )
  );

  const handleDragEnd = async ( event: DragEndEvent ) => {
    const { active, over } = event;

    if ( over && active.id !== over.id ) {
      const activeIndex = courseClasses.findIndex(
        ( classItem ) => classItem.id === active.id
      );
      const overIndex = courseClasses.findIndex(
        ( classItem ) => classItem.id === over.id
      );

      if ( activeIndex !== -1 && overIndex !== -1 ) {
        try {
          const activeClassId = courseClasses[ activeIndex ].id;
          const overClass = courseClasses[ overIndex ];
          const newPosition = overClass.positionOrder !== undefined ? overClass.positionOrder : overIndex;

          await updateOrder( activeClassId, newPosition );
          await refetch();

          addToast( {
            title: "Éxito",
            description: "Posición actualizada correctamente",
            color: "success",
          } );
        } catch ( error ) {
          console.error( "Error al actualizar posición:", error );
          addToast( {
            title: "Error",
            description: "No se pudo actualizar la posición de la clase",
            color: "danger",
          } );
        }
      }
    }
  };

  const handleEditClass = ( id: string ) => {
    setSelectedClassId( id );
    setIsFormModalOpen( true );
  };

  const handleDeleteClass = ( id: string, title: string ) => {
    setClassToDelete( id );
    setClassTitle( title );
    setIsDeleteModalOpen( true );
  };

  const handleAddClass = () => {
    setSelectedClassId( undefined );
    setIsFormModalOpen( true );
  };

  const handleSelectClass = ( id: string ) => {
    if ( onSelectClass ) {
      onSelectClass( id );
    }
  };

  const onConfirmDelete = async () => {
    if ( !classToDelete || !classTitle ) return;

    try {
      await removeClass( classToDelete );
      await refetch();

      addToast( {
        title: "Éxito",
        description: `La clase "${ classTitle }" ha sido eliminada correctamente.`,
        color: "success",
      } );

      setIsDeleteModalOpen( false );
      setClassToDelete( undefined );
      setClassTitle( undefined );
    } catch ( error ) {
      addToast( {
        title: "Error",
        description: `Hubo un problema al eliminar la clase "${ classTitle }".`,
        color: "danger",
      } );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <UI.Button
          size="sm"
          color="primary"
          startContent={ <Icons.IoAddOutline size={ 16 } /> }
          onPress={ handleAddClass }
        >
          Agregar clase
        </UI.Button>
      </div>

      { isLoading ? (
        <div className="flex justify-center items-center h-32">
          <UI.Spinner color="primary" size="lg" />
        </div>
      ) : courseClasses.length === 0 ? (
        <UI.Card>
          <UI.CardBody className="flex items-center justify-center py-6">
            <div className="text-center">
              <Icons.IoInformationCircleOutline className="text-4xl text-default-300 mx-auto mb-3" />
              <p className="text-default-500">
                Esta sección aún no tiene clases
              </p>
            </div>
          </UI.CardBody>
        </UI.Card>
      ) : (
        <DndContext
          collisionDetection={ closestCenter }
          sensors={ sensors }
          onDragEnd={ handleDragEnd }
        >
          <SortableContext
            items={ courseClasses.map( ( classItem ) => ( { id: classItem.id } ) ) }
            strategy={ verticalListSortingStrategy }
          >
            <div className="space-y-2">
              { courseClasses.map( ( classItem ) => (
                <SortableClass
                  key={ classItem.id }
                  classItem={ classItem }
                  onDelete={ handleDeleteClass }
                  onEdit={ handleEditClass }
                  onSelect={ handleSelectClass }
                  isSelected={ false }
                />
              ) ) }
            </div>
          </SortableContext>
        </DndContext>
      ) }

      <ClassFormModal
        isOpen={ isFormModalOpen }
        courseSectionId={ sectionid }
        classId={ selectedClassId }
        onClose={ () => {
          setIsFormModalOpen( false );
          setSelectedClassId( undefined );
        } }
      />

      <DeleteClassModal
        isOpen={ isDeleteModalOpen }
        isPending={ isDeletePending }
        classTitle={ classTitle || "" }
        onCancel={ () => setIsDeleteModalOpen( false ) }
        onConfirm={ onConfirmDelete }
      />
    </div>
  );
};