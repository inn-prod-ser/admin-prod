import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addInstructorCourse } from '../services';
import { ICourseInstructor } from '../interfaces';




export const useAddInstructorToCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( {
      courseId,
      instructorId,
    }: {
      courseId: string;
      instructorId: string;
    } ) => addInstructorCourse( courseId, instructorId ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructor' ] } );
      queryClient.invalidateQueries( { queryKey: [ 'courseInstructors' ] } );

      return data;
    },
  } );

  const addToCourse = async (
    courseId: string,
    instructorId: string,
  ): Promise<ICourseInstructor> => {
    const result = await mutation.mutateAsync( { courseId, instructorId } );

    return result;
  };

  return {
    addToCourse,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
