import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClassContent } from "../services";

export const useDeleteClassContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( id: string ) => deleteClassContent( id ),
    onSuccess: () => {
      queryClient.invalidateQueries( { queryKey: [ "classContents" ] } );
      queryClient.invalidateQueries( { queryKey: [ "classContent" ] } );
    },
    retry: 2,
    retryDelay: ( attemptIndex ) => Math.min( 1000 * 2 ** attemptIndex, 10000 ),
  } );

  const deleteClassContentById = async ( id: string ): Promise<void> => {
    await mutation.mutateAsync( id );
  };

  return {
    deleteClassContentById,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};