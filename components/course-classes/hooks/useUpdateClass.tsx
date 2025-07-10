import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassInputs } from "../validators";
import { IClassCourseResponse } from "../interfaces";
import { updateClass } from "../services";

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassInputs }) =>
      updateClass(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["classes-by-section"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-class"],
      });

      return data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const updateCourseClass = async (
    id: string,
    data: ClassInputs,
  ): Promise<IClassCourseResponse> => {
    const result = await mutation.mutateAsync({ id, data });

    return result;
  };

  return {
    updateCourseClass,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
