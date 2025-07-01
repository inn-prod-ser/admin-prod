import { CategoryForm } from "./CategoryForm";

import { UI } from "@/components";
import { Icons } from "@/components/shared/ui";

interface Props {
  id?: string;
  isOpen?: boolean;
  name: string;
  onOpenChange?: (isOpen: boolean) => void;
  triggerElement?: React.ReactNode;
}

export const CategoryFormLayout = ({
  id,
  isOpen: externalIsOpen,
  name,
  onOpenChange: externalOnOpenChange,
  triggerElement,
}: Props) => {
  const internalDisclosure = UI.useDisclosure();

  const isOpen =
    externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;
  const onOpen = externalOnOpenChange
    ? () => externalOnOpenChange(true)
    : internalDisclosure.onOpen;
  const onOpenChange = externalOnOpenChange || internalDisclosure.onOpenChange;

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

      <UI.Modal
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <UI.ModalContent>
          {(onClose) => (
            <>
              <UI.ModalHeader className="flex flex-row gap-1 justify-center items-center">
                {id ? (
                  <>
                    <Icons.IoPencilOutline size={24} /> Editar {name}
                  </>
                ) : (
                  <>
                    <Icons.IoAddOutline size={24} /> Crear {name}
                  </>
                )}
              </UI.ModalHeader>

              <UI.ModalBody>
                <CategoryForm id={id} onClose={onClose} />
              </UI.ModalBody>

              <UI.ModalFooter className="justify-center flex items-center space-x-3">
                <UI.Button
                  color="danger"
                  startContent={<Icons.IoArrowBackOutline size={24} />}
                  variant="light"
                  onPress={onClose}
                >
                  Cerrar
                </UI.Button>

                <UI.Button
                  color="secondary"
                  form="category-form"
                  startContent={<Icons.IoSaveOutline size={24} />}
                  type="submit"
                >
                  Guardar
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};
