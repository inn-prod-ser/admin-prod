import { ColumnDefinition, Icons } from "@/components/shared/ui";
import { Category } from "@/interfaces";
import { UI } from "@/components/shared";

interface Props {
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

export const CategoriesTableColumns = ({
  onEdit,
  onDelete,
}: Props): ColumnDefinition[] => [
  {
    name: "TÍTULO",
    uid: "title",
    searchable: true,
    sortable: true,
  },
  {
    name: "SLUG",
    uid: "slug",
    searchable: true,
    sortable: true,
  },
  {
    name: "VISIBLE",
    uid: "visible",
    sortable: true,
    renderCell: (item: Category) => (
      <div className="flex justify-center items-center">
        {item.visible ? (
          <Icons.IoEyeOutline className="text-success-500" size={20} />
        ) : (
          <Icons.IoEyeOffOutline className="text-danger-500" size={20} />
        )}
      </div>
    ),
  },
  {
    name: "FECHA DE CREACIÓN",
    uid: "creationDate",
    sortable: true,
    renderCell: (item: Category) => <span>{item.creationDate}</span>,
  },
  {
    name: "CREADO POR",
    uid: "createdBy",
    sortable: true,
    renderCell: (item: Category) => (
      <div className="flex items-center gap-2">
        <span>{item.createdBy.name}</span>
        <span>{item.createdBy.lastName}</span>
      </div>
    ),
  },
  {
    name: "ACCIONES",
    uid: "actions",
    sortable: false,
    renderCell: (item: Category) => (
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
              onPress={() => onEdit(item.id)}
            >
              Editar
            </UI.DropdownItem>
            <UI.DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Icons.IoTrashOutline className="text-danger" />}
              textValue="Eliminar"
              onPress={() => onDelete(item.id, item.title)}
            >
              Eliminar
            </UI.DropdownItem>
          </UI.DropdownMenu>
        </UI.Dropdown>
      </div>
    ),
  },
];
