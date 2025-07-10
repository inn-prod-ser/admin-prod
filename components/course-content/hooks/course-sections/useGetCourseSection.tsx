import { useQuery } from "@tanstack/react-query";

import { getCourseSectionById } from "../../services";

export const useGetCourseSection = (id: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courseSection,
  } = useQuery({
    queryKey: ["course-section", id],
    queryFn: () => getCourseSectionById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    courseSection,
  };
};
