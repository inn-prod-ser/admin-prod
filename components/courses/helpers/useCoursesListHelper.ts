"use client";

import { useState } from "react";
import { addToast } from "@heroui/react";

import { useDeleteCourse, useGetCourses } from "../hooks";

import { UI } from "@/components/shared";

export const useCoursesListHelper = () => {
  const { courses, refetch } = useGetCourses();
  const { courseDelete, isPending } = useDeleteCourse();
  const { isOpen, onOpen, onOpenChange } = UI.useDisclosure();

  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined,
  );
  const [courseToDelete, setCourseToDelete] = useState<string | undefined>(
    undefined,
  );
  const [courseTitle, setCourseTitle] = useState<string | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditCourse = (id: string) => {
    setSelectedCourseId(id);
    onOpen();
  };

  const handleDeleteCourse = (id: string, title: string) => {
    setCourseToDelete(id);
    setCourseTitle(title);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!courseToDelete || !courseTitle) return;

    try {
      await courseDelete(courseToDelete);
      await refetch();

      addToast({
        title: "Éxito",
        description: `El curso "${courseTitle}" ha sido eliminado correctamente.`,
        color: "success",
      });

      setIsDeleteModalOpen(false);
      setCourseToDelete(undefined);
      setCourseTitle(undefined);
    } catch (error) {
      addToast({
        title: "Error",
        description: `Hubo un problema al eliminar el curso "${courseTitle}".`,
        color: "danger",
      });
    }
  };

  return {
    courses,
    handleDeleteCourse,
    handleEditCourse,
    isDeleteModalOpen,
    isOpen,
    isPending,
    onConfirmDelete,
    onOpenChange,
    selectedCourseId,
    setIsDeleteModalOpen,
    courseTitle,
  };
};
