import { useQuery } from "@tanstack/react-query";

import { getClassById } from "../services";

export const useGetClass = (id: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courseClass,
  } = useQuery({
    queryKey: ["course-class", id],
    queryFn: () => getClassById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    courseClass,
  };
};
