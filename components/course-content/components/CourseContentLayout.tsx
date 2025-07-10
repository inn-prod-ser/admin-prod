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

import {
  useDeleteCourseSection,
  useGetCourseSectionsByCourseId,
  useUpdateCourseSection,
} from "../hooks";

import { ICourseSection } from "../interfaces";

import {
  CourseSectionFormLayout,
  DeleteCourseSectionModal,
} from "./course-sections";

import { CourseClass, useGetClass } from "@/components/course-classes";
import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";
import { CourseContentForm } from './CourseContentForm';

type SectionUpdateData = {
  title: string;
  description: string;
  slug: string;
  courseId: string;
  positionOrder?: number;
};

const SortableSection = ({
  section,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
  onSelectClass,
}: {
  section: ICourseSection;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onSelectClass: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <UI.Card
        className={`w-full ${isSelected ? 'border-primary border-2' : ''}`}
      >
        <UI.CardHeader className="flex justify-between items-center pb-0">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSelect(section.id)}
          >
            <div
              className="cursor-grab active:cursor-grabbing"
              {...listeners}
              {...attributes}
            >
              <Icons.IoReorderThreeOutline
                className="text-default-400"
                size={20}
              />
            </div>
            <span className="font-medium">{section.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <UI.Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEdit(section.id)}
            >
              <Icons.IoPencilOutline className="text-default-500" size={16} />
            </UI.Button>
            <UI.Button
              isIconOnly
              color="danger"
              size="sm"
              variant="light"
              onPress={() => onDelete(section.id, section.title)}
            >
              <Icons.IoTrashOutline className="text-danger" size={16} />
            </UI.Button>
          </div>
        </UI.CardHeader>
        <UI.CardBody>
          <div className="flex justify-between items-center mt-2">
            <CourseClass
              sectionid={section.id}
              onSelectClass={onSelectClass}
            />
          </div>
        </UI.CardBody>
      </UI.Card>
    </div>
  );
};

export const CourseContentLayout = ({
  courseId,
  courseTitle,
}: {
  courseId?: string;
  courseTitle?: string;
}) => {
  const {
    courseSections = [],
    isLoading,
    refetch,
  } = useGetCourseSectionsByCourseId(courseId || "");

  const { courseSectionDelete, isPending: isDeletePending } =
    useDeleteCourseSection();

  const { updateSection, isPending: isUpdatePending } =
    useUpdateCourseSection();

  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);

  const [sectionToDelete, setSectionToDelete] = useState<string | undefined>(
    undefined,
  );

  const [sectionTitle, setSectionTitle] = useState<string | undefined>(
    undefined,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { courseClass, isLoading: isClassLoading } = useGetClass(selectedClassId || "");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = courseSections.findIndex(
        (section) => section.id === active.id
      );
      const overIndex = courseSections.findIndex(
        (section) => section.id === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const activeSection = courseSections[activeIndex];
        const overSection = courseSections[overIndex];

        try {
          const data: SectionUpdateData = {
            title: activeSection.title,
            description: activeSection.description,
            slug: activeSection.slug,
            courseId: courseId || "",
            positionOrder: overIndex > activeIndex
              ? overSection.positionOrder
              : overSection.positionOrder !== undefined ? overSection.positionOrder - 1 : 0
          };

          await updateSection(activeSection.id, data as any);
          await refetch();

          addToast({
            title: "Éxito",
            description: "Posición actualizada correctamente",
            color: "success",
          });
        } catch (error) {
          console.error("Error al actualizar posición:", error);
          addToast({
            title: "Error",
            description: "No se pudo actualizar la posición de la sección",
            color: "danger",
          });
        }
      }
    }
  };

  const handleEditSection = (id: string) => {
    setSelectedSectionId(id);
  };

  const handleDeleteSection = (id: string, title: string) => {
    setSectionToDelete(id);
    setSectionTitle(title);
    setIsDeleteModalOpen(true);
  };

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setSelectedClassId(undefined);
  };

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
  };

  const onConfirmDelete = async () => {
    if (!sectionToDelete || !sectionTitle) return;

    try {
      await courseSectionDelete(sectionToDelete);
      await refetch();

      addToast({
        title: "Éxito",
        description: `La sección "${sectionTitle}" ha sido eliminada correctamente.`,
        color: "success",
      });

      setIsDeleteModalOpen(false);
      setSectionToDelete(undefined);
      setSectionTitle(undefined);
    } catch (error) {
      addToast({
        title: "Error",
        description: `Hubo un problema al eliminar la sección "${sectionTitle}".`,
        color: "danger",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <CourseSectionFormLayout courseId={courseId || ""} name="sección" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <UI.Spinner color="primary" size="lg" />
          </div>
        ) : courseSections.length === 0 ? (
          <UI.Card>
            <UI.CardBody className="flex items-center justify-center">
              <div className="text-center">
                <Icons.IoInformationCircleOutline className="text-5xl text-default-300 mx-auto mb-4" />
                <p className="text-default-500">
                  Este curso aún no tiene secciones
                </p>
              </div>
            </UI.CardBody>
          </UI.Card>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={courseSections.map((section) => ({ id: section.id }))}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {courseSections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onDelete={handleDeleteSection}
                    onEdit={handleEditSection}
                    onSelect={handleSelectSection}
                    isSelected={selectedSectionId === section.id}
                    onSelectClass={handleSelectClass}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="md:col-span-2">
        {selectedClassId ? (
          <UI.Card>
            <UI.CardHeader className="pb-0">
              <h3 className="text-lg font-semibold">
                {courseClass?.title || "Cargando clase..."}
              </h3>
            </UI.CardHeader>
            <UI.CardBody>
              <CourseContentForm idClass={courseClass?.id || ''} />
            </UI.CardBody>
          </UI.Card>
        ) : selectedSectionId ? (
          <UI.Card>
            <UI.CardHeader className="pb-0">
              <h3 className="text-lg font-semibold">
                {courseSections.find(section => section.id === selectedSectionId)?.title || "Sección seleccionada"}
              </h3>
            </UI.CardHeader>
            <UI.CardBody>
              <p className="text-default-500 mb-4">
                Selecciona una clase para ver sus detalles
              </p>
              <CourseClass
                sectionid={selectedSectionId}
                onSelectClass={handleSelectClass}
              />
            </UI.CardBody>
          </UI.Card>
        ) : (
          <UI.Card>
            <UI.CardBody className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <Icons.IoInformationCircleOutline className="text-5xl text-default-300 mx-auto mb-4" />
                <p className="text-default-500">
                  Toca una clase para verla aquí
                </p>
              </div>
            </UI.CardBody>
          </UI.Card>
        )}
      </div>

      {selectedSectionId && (
        <CourseSectionFormLayout
          courseId={courseId || ""}
          id={selectedSectionId}
          isOpen={!!selectedSectionId}
          name="sección"
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedSectionId(undefined);
          }}
        />
      )}

      <DeleteCourseSectionModal
        isOpen={isDeleteModalOpen}
        isPending={isDeletePending}
        sectionTitle={sectionTitle || ""}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};