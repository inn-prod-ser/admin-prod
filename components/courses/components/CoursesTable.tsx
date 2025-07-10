"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { ICoursesResponse } from "../../../interfaces/courses-response";
import { Icons } from "../../shared/ui";
import { useGetCourses } from "../hooks";

interface Props {
  courseStatus: "published" | "deleted" | "hidden";
}

const columns = [
  { name: "TÍTULO", uid: "title", sortable: true },
  { name: "SLUG", uid: "slug", sortable: true },
  { name: "DESCRIPCIÓN", uid: "description", sortable: true },
  { name: "PRECIO", uid: "price", sortable: true },
  { name: "PÚBLICO", uid: "isPublic", sortable: true },
  { name: "CATEGORÍAS", uid: "categories", sortable: false },
  { name: "ACCIONES", uid: "actions", sortable: false },
];

type CourseKey =
  | "title"
  | "slug"
  | "description"
  | "price"
  | "isPublic"
  | "categories";

export const CoursesTable = ({ courseStatus }: Props) => {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((column) => column.uid)),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title" as any,
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { courses, isLoading, isError, error, refetch } = useGetCourses();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!courses) return [];

    let filteredCourses = [...courses];

    if (hasSearchFilter) {
      filteredCourses = filteredCourses.filter((course) => {
        const searchText = filterValue.toLowerCase();

        if (
          course.title.toLowerCase().includes(searchText) ||
          course.slug.toLowerCase().includes(searchText) ||
          course.description.toLowerCase().includes(searchText) ||
          course.price.toString().includes(searchText)
        ) {
          return true;
        }

        if (
          (course.isPublic && "público".includes(searchText)) ||
          (course.isPublic && "publico".includes(searchText)) ||
          (!course.isPublic && "privado".includes(searchText))
        ) {
          return true;
        }

        if (
          course.categories.some((category) =>
            category.title.toLowerCase().includes(searchText),
          )
        ) {
          return true;
        }

        return false;
      });
    }

    return filteredCourses;
  }, [courses, filterValue]);

  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ICoursesResponse];
      const second = b[sortDescriptor.column as keyof ICoursesResponse];

      if (sortDescriptor.column === "price") {
        return sortDescriptor.direction === "ascending"
          ? Number(first) - Number(second)
          : Number(second) - Number(first);
      }

      if (sortDescriptor.column === "isPublic") {
        return sortDescriptor.direction === "ascending"
          ? Number(first) - Number(second)
          : Number(second) - Number(first);
      }

      const cmp = (first as string).localeCompare(second as string);

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = useCallback(
    (course: ICoursesResponse, columnKey: CourseKey | "actions") => {
      switch (columnKey) {
        case "title":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-medium capitalize">{course.title}</p>
            </div>
          );
        case "slug":
          return <p className="text-medium">{course.slug}</p>;
        case "description":
          return (
            <div className="max-w-xs">
              <p className="text-medium truncate">{course.description}</p>
            </div>
          );
        case "price":
          return <p className="text-medium">${course.price.toFixed(2)}</p>;
        case "isPublic":
          return (
            <div className="flex justify-center">
              {course.isPublic ? (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <Icons.IoEyeOutline className="w-3.5 h-3.5 mr-1" />
                  Público
                </div>
              ) : (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <Icons.IoEyeOffOutline className="w-3.5 h-3.5 mr-1" />
                  Privado
                </div>
              )}
            </div>
          );
        case "categories":
          return (
            <div className="flex flex-wrap gap-1">
              {course.categories.map((category) => (
                <div
                  key={category.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {category.title}
                </div>
              ))}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <Icons.IoEllipsisVerticalOutline className="text-default-500" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Acciones disponibles">
                  <DropdownItem
                    key="view"
                    startContent={
                      <Icons.IoEyeOutline className="text-default-500" />
                    }
                  >
                    Ver detalles
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={
                      <Icons.IoPencilOutline className="text-default-500" />
                    }
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <Icons.IoTrashOutline className="text-danger" />
                    }
                  >
                    Eliminar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            ref={searchInputRef}
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Buscar cursos..."
            size="sm"
            startContent={
              <Icons.IoSearchOutline className="text-default-300" />
            }
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icons.IoChevronDownOutline className="text-small" />
                  }
                  size="sm"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Selecciona columnas visibles"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-primary text-white"
              endContent={<Icons.IoAddOutline />}
              size="sm"
            >
              Agregar Curso
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} cursos
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onClear,
    visibleColumns,
    filteredItems.length,
    rowsPerPage,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  return (
    <div className="w-full">
      <Table
        isHeaderSticky
        aria-label="Tabla de cursos"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        sortDescriptor={sortDescriptor as any}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor as any}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No se encontraron cursos" items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as CourseKey | "actions")}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
