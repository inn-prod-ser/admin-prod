"use client";

import { ICourseClassesResponse } from "../interfaces";
import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

interface ClassItemProps {
  classItem: ICourseClassesResponse;
  onEdit: ( id: string ) => void;
  onDelete: ( id: string, title: string ) => void;
  onSelect?: ( id: string ) => void;
  isSelected?: boolean;
  dragHandleProps?: any;
}

export const ClassItem = ( {
  classItem,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false,
  dragHandleProps,
}: ClassItemProps ) => {
  return (
    <UI.Card
      className={ `w-full mb-2 ${ isSelected ? 'border-primary border-2' : '' }` }
    >
      <UI.CardBody className="py-2 px-3">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={ () => onSelect && onSelect( classItem.id ) }
          >
            { dragHandleProps && (
              <div
                className="cursor-grab active:cursor-grabbing"
                { ...dragHandleProps }
              >
                <Icons.IoReorderThreeOutline
                  className="text-default-400"
                  size={ 18 }
                />
              </div>
            ) }
            <span className="font-medium">{ classItem.title }</span>
          </div>
          <div className="flex items-center gap-1">
            <UI.Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={ () => onEdit( classItem.id ) }
            >
              <Icons.IoPencilOutline className="text-default-500" size={ 16 } />
            </UI.Button>
            <UI.Button
              isIconOnly
              color="danger"
              size="sm"
              variant="light"
              onPress={ () => onDelete( classItem.id, classItem.title ) }
            >
              <Icons.IoTrashOutline className="text-danger" size={ 16 } />
            </UI.Button>
          </div>
        </div>
      </UI.CardBody>
    </UI.Card>
  );
};