import { useQuery } from "@tanstack/react-query";

import { getCourses } from "../services";

export const useGetCourses = () => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courses,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    courses,
    refetch,
  };
};
