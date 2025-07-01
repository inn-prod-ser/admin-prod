import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassInputs } from "../validators";
import { IClassCourseResponse } from "../interfaces";
import { createClass } from "../services";

export const useAddClass = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (classData: ClassInputs) => createClass(classData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["classes-by-section"],
      });

      return data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const addClass = async (
    classData: ClassInputs,
  ): Promise<IClassCourseResponse> => {
    const result = await mutation.mutateAsync(classData);

    return result;
  };

  return {
    addClass,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
