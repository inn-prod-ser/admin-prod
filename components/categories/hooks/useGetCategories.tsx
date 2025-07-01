import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services";

export const useGetCategories = () => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: categories,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    categories,
    refetch,
  };
};
