"use client";

import { useMemo } from "react";

import { ICourseInstructor, UI, useGetCourseInstructors } from "@/components";


interface Props {
  value: string[];
  onChange: ( ids: string[] ) => void;
}

export const InstructorSelect = ( { value, onChange }: Props ) => {
  const { instructors = [], isLoading } = useGetCourseInstructors();

  const items = useMemo(
    () =>
      instructors
        .filter( ( i ) => i.isActive )
        .map( ( i ) => ( {
          ...i,
          label: i.fullName,
          value: i.id,
          avatar: i.profilePictureUrl,
          profesionalTitle: i.profesionalTitle,
        } ) ),
    [ instructors ],
  );

  return (
    <UI.Select
      label="Instructores"
      labelPlacement="outside"
      placeholder="Selecciona uno o varios instructores"
      isLoading={ isLoading }
      items={ items }
      selectionMode="multiple"
      selectedKeys={ new Set( value ) }
      onSelectionChange={ ( selected ) =>
        onChange( Array.from( selected as Set<string> ) )
      }
      className="w-full"
      renderValue={ ( selectedItems ) =>
        <div className="flex flex-wrap gap-2">
          { items
            .filter( ( i ) => value.includes( i.id ) )
            .map( ( i ) => (
              <div key={ i.id } className="flex items-center gap-2 px-2 py-1 bg-default-100 rounded-lg">
                <img src={ i.avatar } alt={ i.label } className="w-8 h-8 rounded-full object-cover" />
                <span className="font-medium">{ i.label }</span>
                <span className="text-xs text-default-500">{ i.profesionalTitle }</span>
              </div>
            ) ) }
        </div>
      }
    >
      { ( item: ICourseInstructor ) => (
        <UI.SelectItem key={ item.id } textValue={ item.fullName }>
          <div className="flex items-center gap-3">
            <img
              src={ item.profilePictureUrl }
              alt={ item.fullName }
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold">{ item.fullName }</span>
              <span className="text-xs text-default-500">{ item.profesionalTitle }</span>
            </div>
          </div>
        </UI.SelectItem>
      ) }
    </UI.Select>
  );
};
