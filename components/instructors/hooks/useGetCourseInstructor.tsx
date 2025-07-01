import { useQuery } from '@tanstack/react-query';

import { getCourseInstructorById } from '../services';



export const useGetCourseInstructor = ( id: string ) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: courseInstructor,
  } = useQuery( {
    queryKey: [ 'courseInstructor' ],
    queryFn: () => getCourseInstructorById( id ),
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    courseInstructor,
  };
};
