import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "../services";
import { CategoryInputs } from "../validators";

import { Category } from "@/interfaces";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (category: CategoryInputs) => createCategory(category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      return data;
    },
  });

  const addNewCategory = async (
    category: CategoryInputs,
  ): Promise<Category> => {
    const result = await mutation.mutateAsync(category);

    return result;
  };

  return {
    addNewCategory,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
