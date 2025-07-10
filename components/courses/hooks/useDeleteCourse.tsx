import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCourse } from "../services";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const courseDelete = async (id: string): Promise<void> => {
    await mutation.mutateAsync(id);
  };

  return {
    courseDelete,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
