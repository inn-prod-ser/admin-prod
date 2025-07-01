// useUpdateClassOrder.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IClassCourseResponse } from "../interfaces";
import { updateClassOrder } from "../services";

export const useUpdateClassOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( { id, positionOrder }: { id: string; positionOrder: number; } ) =>
      updateClassOrder( id, positionOrder ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ "classes-by-section" ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ "course-class" ],
      } );

      return data;
    },
    retry: 2,
    retryDelay: ( attemptIndex ) => Math.min( 1000 * 2 ** attemptIndex, 10000 ),
  } );

  const updateOrder = async (
    id: string,
    positionOrder: number,
  ): Promise<IClassCourseResponse> => {
    const result = await mutation.mutateAsync( { id, positionOrder } );
    return result;
  };

  return {
    updateOrder,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};