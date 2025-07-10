import { useQuery } from "@tanstack/react-query";

import { getClassContentsByClassId } from "../services";

export const useGetClassContentByClassId = ( courseClassId: string ) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: classContents,
    refetch,
  } = useQuery( {
    queryKey: [ "classContents", courseClassId ],
    queryFn: () => getClassContentsByClassId( courseClassId ),
    enabled: !!courseClassId,
    refetchOnWindowFocus: false,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    classContents,
    refetch,
  };
};