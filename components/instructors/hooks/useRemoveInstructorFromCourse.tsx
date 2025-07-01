import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeInstructorCourse } from '../services';
import { ICourseInstructor } from '../interfaces';





export const useRemoveInstructorFromCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( {
      courseId,
      instructorId,
    }: {
      courseId: string;
      instructorId: string;
    } ) => removeInstructorCourse( courseId, instructorId ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructor' ] } );
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructors' ] } );

      return data;
    },
  } );

  const removeFromCourse = async (
    courseId: string,
    instructorId: string,
  ): Promise<ICourseInstructor> => {
    const result = await mutation.mutateAsync( { courseId, instructorId } );

    return result;
  };

  return {
    removeFromCourse,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
