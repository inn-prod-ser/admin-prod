import { useQuery } from "@tanstack/react-query";

import { getCategoryById } from "../services";

export const useGetCategory = (id: string) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: category,
  } = useQuery({
    queryKey: ["category"],
    queryFn: () => getCategoryById(id),
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    category,
  };
};
