import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategoryInputs } from "../validators";
import { updateCategory } from "../services";

import { Category } from "@/interfaces";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Category,
    Error,
    { category: CategoryInputs; id: string }
  >({
    mutationFn: ({ id, category }) => updateCategory(id, category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      return data;
    },
  });

  const categoryUpdate = async (
    category: CategoryInputs,
    id: string,
  ): Promise<Category> => {
    const result = await mutation.mutateAsync({ id, category });

    return result;
  };

  return {
    categoryUpdate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
