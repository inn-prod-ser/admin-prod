import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClass } from "../services";

export const useRemoveClass = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes-by-section"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-class"],
      });
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const removeClass = async (id: string): Promise<void> => {
    await mutation.mutateAsync(id);
  };

  return {
    removeClass,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
