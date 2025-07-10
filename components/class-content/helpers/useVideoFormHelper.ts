'use client';

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { useAddClassContent, useGetClassContentById, useUpdateClassContent } from '../hooks';
import { ClassContentInputs } from "../validators";

export const useClassContentFormHelper = (
  id: string | undefined,
  form: UseFormReturn<ClassContentInputs>,
  courseClassIdForCreation: string | undefined,
) => {
  const { addNewClassContent } = useAddClassContent();
  const { updateClassContentById } = useUpdateClassContent();
  const { classContent, isLoading } = useGetClassContentById(id || "");

  useEffect(() => {
    if (id && classContent && !isLoading) {
      form.reset({
        content: classContent.content,
        contentType: classContent.contentType as "slides" | "video" | "text",
        courseClassId: classContent.courseClass.id,
      });
    } else if (!id) {
      form.reset({
        content: "",
        contentType: "video",
        courseClassId: courseClassIdForCreation || "",
      });
    }
  }, [id, classContent, isLoading, form.reset, courseClassIdForCreation]);

  const handleSave = async (data: ClassContentInputs, onClose: () => void) => {
    if (id) {
      await updateClassContentById(id, data);
    } else {
      await addNewClassContent(data);
    }
    onClose();
  };

  return {
    handleSave,
  };
};