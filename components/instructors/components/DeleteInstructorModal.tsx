import { UI } from "@/components/shared";
import { Icons } from "@/components/shared/ui";

interface Props {
  isOpen: boolean;
  isPending: boolean;
  instructorFullName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteInstructorModal = ( {
  isOpen,
  isPending,
  instructorFullName,
  onCancel,
  onConfirm,
}: Props ) => (
  <UI.Modal isOpen={ isOpen } onOpenChange={ onCancel }>
    <UI.ModalContent>
      <UI.ModalHeader className="flex flex-row justify-center space-x-2">
        <Icons.IoTrashOutline size={ 24 } />
        <h3 className="text-lg font-semibold">Confirmar eliminación</h3>
      </UI.ModalHeader>
      <UI.ModalBody>
        <p>
          ¿Estás seguro que deseas eliminar el instructor{ " " }
          <strong>{ instructorFullName }</strong>? Esta acción no se puede deshacer.
        </p>
      </UI.ModalBody>
      <UI.ModalFooter className="flex flex-row justify-center space-x-2">
        <UI.Button
          color="default"
          startContent={ <Icons.IoArrowBackOutline size={ 20 } /> }
          variant="flat"
          onPress={ onCancel }
        >
          Cancelar
        </UI.Button>
        <UI.Button
          color="danger"
          isLoading={ isPending }
          startContent={ <Icons.IoTrashOutline size={ 20 } /> }
          onPress={ onConfirm }
        >
          Eliminar
        </UI.Button>
      </UI.ModalFooter>
    </UI.ModalContent>
  </UI.Modal>
);
