import { ColumnDefinition, Icons } from "@/components/shared/ui";
import { ICourseInstructor } from "../interfaces";
import { UI } from "@/components/shared";

interface Props {
  onEdit: ( id: string ) => void;
  onDelete: ( id: string, fullName: string ) => void;
}

export const InstructorsTableColumns = ( {
  onEdit,
  onDelete,
}: Props ): ColumnDefinition[] => [
    {
      name: "NOMBRE COMPLETO",
      uid: "fullName",
      searchable: true,
      sortable: true,
    },
    {
      name: "TÍTULO PROFESIONAL",
      uid: "profesionalTitle",
      searchable: true,
      sortable: true,
    },
    {
      name: "IMAGEN DE PERFIL",
      uid: "profilePictureUrl",
      sortable: false,
      renderCell: ( item: ICourseInstructor ) => (
        <img
          src={ item.profilePictureUrl }
          alt={ item.fullName }
          className="w-10 h-10 rounded-full object-cover mx-auto"
        />
      ),
    },
    {
      name: "FECHA DE CREACIÓN",
      uid: "creationDate",
      sortable: true,
      renderCell: ( item: ICourseInstructor ) => <span>{ item.creationDate }</span>,
    },
    {
      name: "ACTIVO",
      uid: "isActive",
      sortable: true,
      renderCell: ( item: ICourseInstructor ) => (
        <div className="flex justify-center items-center">
          { item.isActive ? (
            <Icons.IoCheckmarkCircleOutline className="text-success-500" size={ 20 } />
          ) : (
            <Icons.IoCloseCircleOutline className="text-danger-500" size={ 20 } />
          ) }
        </div>
      ),
    },
    {
      name: "ACCIONES",
      uid: "actions",
      sortable: false,
      renderCell: ( item: ICourseInstructor ) => (
        <div className="relative flex items-center justify-center">
          <UI.Dropdown>
            <UI.DropdownTrigger>
              <UI.Button isIconOnly size="sm" variant="light">
                <Icons.IoEllipsisVerticalOutline className="text-default-500" />
              </UI.Button>
            </UI.DropdownTrigger>
            <UI.DropdownMenu aria-label="Acciones disponibles">
              <UI.DropdownItem
                key="edit"
                startContent={
                  <Icons.IoPencilOutline className="text-default-500" />
                }
                textValue="Editar"
                onPress={ () => onEdit( item.id ) }
              >
                Editar
              </UI.DropdownItem>
              <UI.DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={ <Icons.IoTrashOutline className="text-danger" /> }
                textValue="Eliminar"
                onPress={ () => onDelete( item.id, item.fullName ) }
              >
                Eliminar
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </div>
      ),
    },
  ];
