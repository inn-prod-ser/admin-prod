import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassContentInputs } from "../validators";
import { IClassContentResponse } from '../interfaces';
import { updateClassContent } from "../services";



export const useUpdateClassContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IClassContentResponse,
    Error,
    { id: string; classContent: ClassContentInputs; }
  >( {
    mutationFn: ( { id, classContent } ) =>
      updateClassContent( id, classContent ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ "classContent" ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ "classContents" ],
      } );

      return data;
    },
    retry: 2,
    retryDelay: ( attemptIndex ) => Math.min( 1000 * 2 ** attemptIndex, 10000 ),
  } );

  const updateClassContentById = async (
    id: string,
    classContent: ClassContentInputs,
  ): Promise<IClassContentResponse> => {
    const result = await mutation.mutateAsync( { id, classContent } );

    return result;
  };

  return {
    updateClassContentById,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};