import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  useAddCourseInstructor,
  useGetCourseInstructors,
  useGetCourseInstructor,
  useUpdateCourseInstructor,
} from "../hooks";

import { CourseInstructorInputs } from "@/components";

const normalizeString = ( str: string ) =>
  str
    .normalize( "NFD" )
    .replace( /[\u0300-\u036f]/g, "" )
    .replace( /[^\w\s]/gi, "" )
    .trim()
    .toLowerCase();

export const useInstructorsFormHelper = (
  id: string | undefined,
  form: UseFormReturn<CourseInstructorInputs>,
) => {
  const { addNewCourseInstructor } = useAddCourseInstructor();
  const { courseInstructorUpdate } = useUpdateCourseInstructor();
  const { courseInstructor } = useGetCourseInstructor( id || "" );
  const { instructors = [] } = useGetCourseInstructors();

  const existingFullNames = useMemo(
    () =>
      instructors
        .filter( ( ins ) => ( id ? ins.id !== id : true ) )
        .map( ( ins ) => normalizeString( ins.fullName ) ),
    [ instructors, id ],
  );

  useEffect( () => {
    if ( id && courseInstructor ) {
      form.reset( {
        fullName: courseInstructor.fullName,
        profilePictureUrl: courseInstructor.profilePictureUrl,
        profesionalTitle: courseInstructor.profesionalTitle,
      } );
    }
  }, [ id, courseInstructor, form ] );

  const validateUniqueFullName = ( value: string ) => {
    const normalizedInput = normalizeString( value );

    return existingFullNames.includes( normalizedInput )
      ? "Este instructor ya existe."
      : true;
  };

  const handleSave = async ( data: CourseInstructorInputs, onClose: () => void ) => {
    await ( id ? courseInstructorUpdate( data, id ) : addNewCourseInstructor( data ) );
    onClose();
  };

  return {
    handleSave,
    validateUniqueFullName,
    existingFullNames,
  };
};
