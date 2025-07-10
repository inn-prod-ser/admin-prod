import { useQuery } from "@tanstack/react-query";

import { getCourseSectionsByCourseId } from "../../services";

export const useGetCourseSectionsByCourseId = (courseId: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courseSections,
    refetch,
  } = useQuery({
    queryKey: ["course-sections-by-course", courseId],
    queryFn: () => getCourseSectionsByCourseId(courseId),
    enabled: !!courseId,
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
    courseSections,
    refetch,
  };
};
