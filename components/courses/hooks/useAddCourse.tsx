import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CourseInputs } from "../validators";
import { createCourse } from "../services";

import { ICoursesResponse } from "@/interfaces";

export const useAddCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (course: CourseInputs) => createCourse(course),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      return data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const addNewCourse = async (
    course: CourseInputs,
  ): Promise<ICoursesResponse> => {
    const result = await mutation.mutateAsync(course);

    return result;
  };

  return {
    addNewCourse,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
