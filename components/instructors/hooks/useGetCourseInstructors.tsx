import { useQuery } from '@tanstack/react-query';

import { getCourseInstructors } from '../services';
import { ICourseInstructor } from '../interfaces';



export const useGetCourseInstructors = () => {
  const {
    data: instructors,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<ICourseInstructor[], Error>( {
    queryKey: [ 'courseInstructors' ],
    queryFn: getCourseInstructors,
    refetchOnWindowFocus: false,
  } );

  return {
    instructors,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
