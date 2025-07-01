import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCourseSection } from "../../services";
import { CreateSectionInputs } from "../../validators";
import { ICourseSection } from "../../interfaces";

export const useAddCourseSection = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (section: CreateSectionInputs) => createCourseSection(section),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-sections-by-course"],
      });

      return data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const addNewCourseSection = async (
    section: CreateSectionInputs,
  ): Promise<ICourseSection> => {
    const result = await mutation.mutateAsync(section);

    return result;
  };

  return {
    addNewCourseSection,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
