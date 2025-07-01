import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ICourseSection } from "../../interfaces";
import { updateCourseSection } from "../../services";
import { UpdateSectionInputs } from "../../validators";

export const useUpdateCourseSection = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionInputs }) =>
      updateCourseSection(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-sections-by-course"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-section"],
      });

      return data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const updateSection = async (
    id: string,
    data: UpdateSectionInputs,
  ): Promise<ICourseSection> => {
    const result = await mutation.mutateAsync({ id, data });

    return result;
  };

  return {
    updateSection,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
