"use client";

import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  useAddCourseSection,
  useGetCourseSectionsByCourseId,
  useGetCourseSection,
  useUpdateCourseSection,
} from "../hooks";
import {
  CreateSectionInputs,
  UpdateSectionInputs,
} from "../validators/CourseSectionSchema";

const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim()
    .toLowerCase();

export const useCourseSectionFormHelper = (
  id: string | undefined,
  form: UseFormReturn<CreateSectionInputs>,
) => {
  const { addNewCourseSection } = useAddCourseSection();
  const { updateSection } = useUpdateCourseSection();
  const { courseSection } = useGetCourseSection(id || "");
  const { courseSections = [] } = useGetCourseSectionsByCourseId(
    form.getValues().courseId || "",
  );

  const existingTitles = useMemo(
    () =>
      courseSections
        .filter((section) => (id ? section.id !== id : true))
        .map((section) => normalizeString(section.title)),
    [courseSections, id],
  );

  useEffect(() => {
    if (id && courseSection) {
      form.reset({
        title: courseSection.title,
        description: courseSection.description,
        slug: courseSection.slug,
        courseId: courseSection.course?.id || form.getValues().courseId,
      });
    }
  }, [courseSection, form, id]);

  const validateUniqueTitle = (value: string) => {
    const normalizedInput = normalizeString(value);

    return existingTitles.includes(normalizedInput)
      ? "Esta sección ya existe."
      : true;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSave = async (data: CreateSectionInputs, onClose: () => void) => {
    if (id) {
      const updateData: UpdateSectionInputs = {
        title: data.title,
        description: data.description,
        slug: data.slug,
        courseId: data.courseId,
      };

      try {
        await updateSection(id, updateData);
        onClose();
      } catch (error) {
        console.error("Error al actualizar sección:", error);
        throw error;
      }
    } else {
      try {
        await addNewCourseSection(data);
        onClose();
      } catch (error) {
        console.error("Error al crear sección:", error);
        throw error;
      }
    }
  };

  return {
    handleSave,
    validateUniqueTitle,
    existingTitles,
    generateSlug,
  };
};
