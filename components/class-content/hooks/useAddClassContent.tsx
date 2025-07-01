import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassContentInputs } from "../validators";
import { createClassContent } from "../services";
import { IClassContentResponse } from '../interfaces';


export const useAddClassContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( classContent: ClassContentInputs ) =>
      createClassContent( classContent ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ "classContents" ],
      } );

      return data;
    },
    retry: 2,
    retryDelay: ( attemptIndex ) => Math.min( 1000 * 2 ** attemptIndex, 10000 ),
  } );

  const addNewClassContent = async (
    classContent: ClassContentInputs,
  ): Promise<IClassContentResponse> => {
    const result = await mutation.mutateAsync( classContent );

    return result;
  };

  return {
    addNewClassContent,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};