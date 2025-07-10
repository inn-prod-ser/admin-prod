import { useQuery } from "@tanstack/react-query";

import { getClassesBySecionId } from "../services";

export const useGetClasses = (sectionId: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courseClasses,
    refetch,
  } = useQuery({
    queryKey: ["classes-by-section", sectionId],
    queryFn: () => getClassesBySecionId(sectionId),
    enabled: !!sectionId,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    courseClasses,
    refetch,
  };
};
