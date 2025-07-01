"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { useAddCourse, useGetCourse, useUpdateCourse } from "../hooks";

import { CourseInputs } from "@/components";
import { useGetCategories } from "@/components/categories/hooks";


export const useCoursesFormHelper = (
  id: string | undefined,
  form: UseFormReturn<CourseInputs>,
) => {
  const { addNewCourse } = useAddCourse();
  const { updateCourse } = useUpdateCourse();
  const { course, isLoading } = useGetCourse( id || "" );
  const { categories = [] } = useGetCategories();

  useEffect( () => {
    if ( id && course && !isLoading ) {
      const availableCategoryIds = categories.map( ( category ) => category.id );
      const validCategoryIds =
        course.categories
          ?.map( ( c: { id: string; } ) => c.id )
          .filter( ( catId ) => availableCategoryIds.includes( catId ) ) || [];

      form.reset( {
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        isPublic: course.isPublic,
        categoryIds: validCategoryIds,
        courseUnderConstruction: course.courseUnderConstruction,
        estimatedDuration: course.estimatedDuration,
        difficultyLevel: course.difficultyLevel,
      } );
    }

    if ( !id ) {
      form.reset( {
        title: "",
        slug: "",
        description: "",
        price: 0,
        isPublic: false,
        categoryIds: [],
        courseUnderConstruction: true,
        estimatedDuration: "1hs",
        difficultyLevel: "Básica",
      } );
    }
  }, [ course, isLoading, form, id, categories ] );

  const handleSave = async ( data: CourseInputs, onClose: () => void ) => {
    if ( id ) {
      await updateCourse( id, data );
    } else {
      await addNewCourse( data );
    }
    onClose();
  };

  return {
    handleSave,
  };
};
