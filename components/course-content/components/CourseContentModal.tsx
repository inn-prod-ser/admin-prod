"use client";
import { CourseContentLayout } from "./CourseContentLayout";

import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export const CourseContentModal = ( {
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: Props ) => {
  return (
    <UI.Modal
      isOpen={ isOpen }
      scrollBehavior="inside"
      size="full"
      onOpenChange={ onClose }
    >
      <UI.ModalContent>
        { ( onCloseModal ) => (
          <>
            <UI.ModalHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <Icons.IoListOutline size={ 24 } />
                <span>{ courseTitle }</span>
              </div>
              <UI.Button
                isIconOnly
                color="danger"
                variant="light"
                onPress={ onCloseModal }
              >
                <Icons.IoCloseOutline size={ 24 } />
              </UI.Button>
            </UI.ModalHeader>

            <UI.ModalBody>
              <CourseContentLayout
                courseId={ courseId }
                courseTitle={ courseTitle }
              />
            </UI.ModalBody>
          </>
        ) }
      </UI.ModalContent>
    </UI.Modal>
  );
};
