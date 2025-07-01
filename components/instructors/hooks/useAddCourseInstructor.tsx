import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCourseInstructor } from '../services';
import { CourseInstructorInputs } from '../validators';
import { ICourseInstructor } from '../interfaces';





export const useAddCourseInstructor = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( instructor: CourseInstructorInputs ) => createCourseInstructor( instructor ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'courseInstructors' ],
      } );

      return data;
    },
  } );

  const addNewCourseInstructor = async (
    instructor: CourseInstructorInputs,
  ): Promise<ICourseInstructor> => {
    const result = await mutation.mutateAsync( instructor );

    return result;
  };

  return {
    addNewCourseInstructor,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
