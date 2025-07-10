import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCourseSection } from "../../services";

export const useDeleteCourseSection = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCourseSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-sections-by-course"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-section"],
      });
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const courseSectionDelete = async (id: string): Promise<void> => {
    await mutation.mutateAsync(id);
  };

  return {
    courseSectionDelete,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
