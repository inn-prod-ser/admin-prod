import { useQuery } from "@tanstack/react-query";

import { getClassContentById } from "../services";

export const useGetClassContentById = ( id: string ) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: classContent,
  } = useQuery( {
    queryKey: [ "classContent", id ],
    queryFn: () => getClassContentById( id ),
    enabled: !!id,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    classContent,
  };
};