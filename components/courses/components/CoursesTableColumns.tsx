import { ColumnDefinition, Icons } from "@/components/shared/ui";
import { UI } from "@/components/shared";
import { ICoursesResponse } from '../interfaces/ICoursesResponse';

interface Props {
  onEdit: ( id: string ) => void;
  onDelete: ( id: string, title: string ) => void;
  onViewContent: ( id: string, title: string ) => void;
}

export const CoursesTableColumns = ( {
  onEdit,
  onDelete,
  onViewContent,
}: Props ): ColumnDefinition[] => [
    {
      name: "TÍTULO",
      uid: "title",
      searchable: true,
      sortable: true,
      renderCell: ( item: ICoursesResponse ) => (
        <span>{ item.title }</span>
      ),
    },
    {
      name: "SLUG",
      uid: "slug",
      searchable: true,
      sortable: true,
    },
    {
      name: "DESCRIPCIÓN",
      uid: "description",
      searchable: true,
      sortable: true,
    },
    {
      name: "PRECIO",
      uid: "price",
      searchable: true,
      sortable: true,
      renderCell: ( item: ICoursesResponse ) => (
        <span>${ item.price.toFixed( 2 ) }</span>
      ),
    },
    {
      name: "DURACIÓN",
      uid: "estimatedDuration",
      sortable: false,
      renderCell: ( item: ICoursesResponse ) => (
        <span>{ item.estimatedDuration }</span>
      ),
    },
    {
      name: "NIVEL",
      uid: "difficultyLevel",
      sortable: false,
      renderCell: ( item: ICoursesResponse ) => (
        <span>{ item.difficultyLevel }</span>
      ),
    },
    {
      name: "PÚBLICO",
      uid: "isPublic",
      sortable: true,
      renderCell: ( item: ICoursesResponse ) => (
        <div className="flex justify-center items-center gap-2">
          { item.isPublic ? (
            <Icons.IoEyeOutline className="text-success-500" size={ 20 } />
          ) : (
            <Icons.IoEyeOffOutline className="text-danger-500" size={ 20 } />
          ) }
          { item.courseUnderConstruction && (
            <Icons.IoConstructOutline
              className="text-warning-500"
              size={ 20 }
              title="Curso en construcción"
            />
          ) }
        </div>
      ),
    },
    {
      name: "CATEGORÍAS",
      uid: "categories",
      sortable: false,
      renderCell: ( item: ICoursesResponse ) => (
        <div className="flex flex-wrap gap-1">
          { item.categories.map( ( category ) => (
            <div
              key={ category.id }
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              { category.title }
            </div>
          ) ) }
        </div>
      ),
    },
    {
      name: "FECHA DE CREACIÓN",
      uid: "creationDate",
      sortable: true,
      renderCell: ( item: ICoursesResponse ) => <span>{ item.creationDate }</span>,
    },
    {
      name: "CREADO POR",
      uid: "createdBy",
      sortable: true,
      renderCell: ( item: ICoursesResponse ) => (
        <div className="flex items-center gap-2">
          <span>{ item.createdBy.name }</span>
          <span>{ item.createdBy.lastName }</span>
        </div>
      ),
    },
    {
      name: "ACCIONES",
      uid: "actions",
      sortable: false,
      renderCell: ( item: ICoursesResponse ) => (
        <div className="relative flex items-center justify-center">
          <UI.Dropdown>
            <UI.DropdownTrigger>
              <UI.Button isIconOnly size="sm" variant="light">
                <Icons.IoEllipsisVerticalOutline className="text-default-500" />
              </UI.Button>
            </UI.DropdownTrigger>
            <UI.DropdownMenu aria-label="Acciones disponibles">
              <UI.DropdownItem
                key="content"
                startContent={
                  <Icons.IoListOutline className="text-default-500" />
                }
                textValue="Contenido del curso"
                onPress={ () => onViewContent( item.id, item.title ) }
              >
                Contenido del curso
              </UI.DropdownItem>
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
                onPress={ () => onDelete( item.id, item.title ) }
              >
                Eliminar
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </div>
      ),
    },
  ];
