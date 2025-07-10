import { useQuery } from "@tanstack/react-query";

import { getCourseById } from "../services";

export const useGetCourse = (id: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: course,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    course,
  };
};
