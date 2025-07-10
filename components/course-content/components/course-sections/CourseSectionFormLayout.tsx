"use client";

import { useState } from "react";

import { CourseSectionForm } from "./CourseSectionForm";

import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

interface Props {
  id?: string;
  courseId: string;
  isOpen?: boolean;
  name: string;
  onOpenChange?: (isOpen: boolean) => void;
  triggerElement?: React.ReactNode;
}

export const CourseSectionFormLayout = ({
  id,
  courseId,
  isOpen: externalIsOpen,
  name,
  onOpenChange: externalOnOpenChange,
  triggerElement,
}: Props) => {
  const internalDisclosure = UI.useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen =
    externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;

  const onOpen = () => {
    setIsSubmitting(false);
    if (externalOnOpenChange) {
      externalOnOpenChange(true);
    } else {
      internalDisclosure.onOpen();
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    if (externalOnOpenChange) {
      externalOnOpenChange(false);
    } else {
      internalDisclosure.onClose();
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 100);
  };

  return (
    <>
      {triggerElement ? (
        <span className="w-full cursor-pointer" onClick={onOpen}>
          {triggerElement}
        </span>
      ) : (
        <UI.Button
          startContent={<Icons.IoAddOutline size={24} />}
          variant="light"
          onPress={onOpen}
        >
          Crear {name}
        </UI.Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-center gap-2">
              {id ? (
                <>
                  <Icons.IoPencilOutline size={24} />{" "}
                  <span className="text-lg font-semibold">Editar {name}</span>
                </>
              ) : (
                <>
                  <Icons.IoAddOutline size={24} />{" "}
                  <span className="text-lg font-semibold">Crear {name}</span>
                </>
              )}
            </div>

            <div className="p-6">
              <CourseSectionForm
                courseId={courseId}
                id={id}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                onClose={handleClose}
              />
            </div>

            <div className="p-4 border-t flex justify-center space-x-3">
              <UI.Button
                color="danger"
                isDisabled={isSubmitting}
                startContent={<Icons.IoArrowBackOutline size={24} />}
                variant="light"
                onPress={handleClose}
              >
                Cerrar
              </UI.Button>

              <UI.Button
                color="secondary"
                form="section-form"
                isLoading={isSubmitting}
                startContent={
                  isSubmitting ? null : <Icons.IoSaveOutline size={24} />
                }
                type="submit"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </UI.Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
