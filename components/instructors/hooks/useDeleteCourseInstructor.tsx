import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCourseInstructor } from '../services';



export const useDeleteCourseInstructor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( id: string ) => deleteCourseInstructor( id ),
    onSuccess: () => {
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructors' ] } );
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructor' ] } );
    },
  } );

  const deleteInstructorById = async ( id: string ): Promise<void> => {
    await mutation.mutateAsync( id );
  };

  return {
    deleteInstructorById,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
