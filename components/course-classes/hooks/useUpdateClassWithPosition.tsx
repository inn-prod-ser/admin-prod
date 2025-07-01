import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassInputs } from "../validators";
import { IClassCourseResponse } from "../interfaces";
import { updateClass } from "../services";

interface UpdateClassWithPositionData extends ClassInputs {
  positionOrder?: number;
}

export const useUpdateClassWithPosition = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( { id, data }: { id: string; data: UpdateClassWithPositionData; } ) =>
      updateClass( id, data ),
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

  const updateClassPosition = async (
    id: string,
    data: UpdateClassWithPositionData,
  ): Promise<IClassCourseResponse> => {
    const result = await mutation.mutateAsync( { id, data } );

    return result;
  };

  return {
    updateClassPosition,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};