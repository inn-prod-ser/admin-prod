import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "../services";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const deleteCategoryById = async (id: string): Promise<void> => {
    await mutation.mutateAsync(id);
  };

  return {
    deleteCategoryById,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
