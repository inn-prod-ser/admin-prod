import { useQuery } from '@tanstack/react-query';

import { getCourseInstructorByCourseId } from '../services';
import { ICourseInstructor } from '../interfaces';





export const useGetCourseInstructorByCourseId = ( courseId: string ) => {

  const {
    data: courseInstructor,
    error,
    isError,
    isFetching,
    isLoading,
  } = useQuery<ICourseInstructor, Error>( {
    queryKey: [ 'courseInstructor', courseId ],
    queryFn: () => getCourseInstructorByCourseId( courseId ),
    refetchOnWindowFocus: false,
    enabled: !!courseId,
  } );

  return {
    courseInstructor,
    isLoading,
    isFetching,
    isError,
    error,
  };

};
