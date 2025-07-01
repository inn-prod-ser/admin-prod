"use client";


import { GenericTable } from "@/components/shared/ui";
import { UI } from "@/components/shared";
import { useInstructorsListHelper } from '../helpers';
import { DeleteInstructorModal } from './DeleteInstructorModal';
import { InstructorFormLayout } from './InstructorFormLayout';
import { InstructorsTableColumns } from './InstructorsTableColumns';


export const InstructorsList = () => {
  const {
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
  } = useInstructorsListHelper();

  return (
    <div className="instructors-list">
      <div className="instructors-list__container">
        <UI.Card>
          <UI.CardBody>
            <GenericTable
              addButtonComponent={ <InstructorFormLayout name="instructor" /> }
              addButtonText="Agregar Instructor"
              columns={ InstructorsTableColumns( {
                onEdit: handleEditInstructor,
                onDelete: handleDeleteInstructor,
              } ) }
              initialRowsPerPage={ 5 }
              initialSortColumn="fullName"
              initialSortDirection="ascending"
              initialVisibleColumns={ [
                "fullName",
                "profesionalTitle",
                "profilePictureUrl",
                "actions",
              ] }
              items={ instructors || [] }
              noItemsMessage="No se encontraron instructores"
              primaryKey="id"
              searchFields={ [ "fullName", "profesionalTitle" ] }
              title="Instructores"
              onAdd={ () => { } }
            />
          </UI.CardBody>
        </UI.Card>
      </div>

      { isOpen && (
        <InstructorFormLayout
          id={ selectedInstructorId }
          isOpen={ isOpen }
          name="instructor"
          onOpenChange={ onOpenChange }
        />
      ) }

      <DeleteInstructorModal
        instructorFullName={ instructorFullName || "" }
        isOpen={ isDeleteModalOpen }
        isPending={ isPending }
        onCancel={ () => setIsDeleteModalOpen( false ) }
        onConfirm={ onConfirmDelete }
      />
    </div>
  );
};
