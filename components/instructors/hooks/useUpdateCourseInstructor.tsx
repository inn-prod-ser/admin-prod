import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCourseInstructor } from '../services';
import { CourseInstructorInputs } from '../validators';
import { ICourseInstructor } from '../interfaces';





export const useUpdateCourseInstructor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ICourseInstructor,
    Error,
    { instructor: CourseInstructorInputs; id: string }
  >( {
    mutationFn: ( { id, instructor } ) => updateCourseInstructor( id, instructor ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'courseInstructor' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'courseInstructors' ],
      } );

      return data;
    },
  } );

  const courseInstructorUpdate = async (
    instructor: CourseInstructorInputs,
    id: string,
  ): Promise<ICourseInstructor> => {
    const result = await mutation.mutateAsync( { id, instructor } );

    return result;
  };

  return {
    courseInstructorUpdate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
