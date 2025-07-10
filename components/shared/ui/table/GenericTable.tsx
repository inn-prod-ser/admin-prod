"use client";

import { useCallback, useMemo, useState, useRef, ReactNode } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { SortDescriptor } from "@react-types/shared";

import { Icons } from "../";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "../nextui-components";

export interface ColumnDefinition {
  name: string;
  uid: string;
  sortable: boolean;
  searchable?: boolean;
  renderCell?: ( item: any, columnKey: string ) => ReactNode;
}

interface GenericTableProps<T> {
  title?: string;
  columns: ColumnDefinition[];
  items: T[];
  primaryKey: keyof T;
  searchFields?: string[];
  onAdd?: () => void;
  addButtonText?: string;
  addButtonComponent?: ReactNode;
  noItemsMessage?: string;
  initialVisibleColumns?: string[];
  initialSortColumn?: string;
  initialSortDirection?: "ascending" | "descending";
  initialRowsPerPage?: number;
}

export const GenericTable = <T extends object>( {
  title,
  columns,
  items: initialItems,
  primaryKey,
  searchFields = [],
  onAdd,
  addButtonText = "Agregar Nuevo",
  addButtonComponent,
  noItemsMessage = "No se encontraron elementos",
  initialVisibleColumns,
  initialSortColumn,
  initialSortDirection = "ascending",
  initialRowsPerPage = 5,
}: GenericTableProps<T> ) => {
  const [ filterValue, setFilterValue ] = useState( "" );
  const [ visibleColumns, setVisibleColumns ] = useState<Set<string>>(
    new Set( initialVisibleColumns || columns.map( ( column ) => column.uid ) ),
  );
  const [ rowsPerPage, setRowsPerPage ] = useState( initialRowsPerPage );
  const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>( {
    column: initialSortColumn || columns[ 0 ].uid,
    direction: initialSortDirection,
  } );
  const [ page, setPage ] = useState( 1 );
  const searchInputRef = useRef<HTMLInputElement>( null );

  const hasSearchFilter = Boolean( filterValue );

  const headerColumns = useMemo( () => {
    if ( visibleColumns.size === columns.length ) return columns;

    return columns.filter( ( column ) => visibleColumns.has( column.uid ) );
  }, [ visibleColumns, columns ] );

  const filteredItems = useMemo( () => {
    let filteredData = [ ...initialItems ];

    if ( hasSearchFilter ) {
      const searchText = filterValue.toLowerCase();

      filteredData = filteredData.filter( ( item ) => {
        if ( searchFields.length > 0 ) {
          return searchFields.some( ( field ) => {
            const value = item[ field as keyof T ];

            if ( value === undefined ) return false;

            if ( typeof value === "string" ) {
              return value.toLowerCase().includes( searchText );
            } else if ( typeof value === "number" ) {
              return value.toString().includes( searchText );
            } else if ( typeof value === "boolean" ) {
              if (
                value &&
                ( "true".includes( searchText ) ||
                  "sí".includes( searchText ) ||
                  "si".includes( searchText ) ||
                  "verdadero".includes( searchText ) )
              ) {
                return true;
              }
              if (
                !value &&
                ( "false".includes( searchText ) ||
                  "no".includes( searchText ) ||
                  "falso".includes( searchText ) )
              ) {
                return true;
              }

              return false;
            } else if ( Array.isArray( value ) ) {
              return value.some( ( v ) => {
                if ( typeof v === "string" ) {
                  return v.toLowerCase().includes( searchText );
                } else if ( typeof v === "object" && v !== null ) {
                  return Object.values( v ).some(
                    ( propValue ) =>
                      typeof propValue === "string" &&
                      propValue.toLowerCase().includes( searchText ),
                  );
                }

                return false;
              } );
            } else if ( typeof value === "object" && value !== null ) {
              return Object.values( value ).some(
                ( propValue ) =>
                  typeof propValue === "string" &&
                  propValue.toLowerCase().includes( searchText ),
              );
            }

            return false;
          } );
        } else {
          return Object.entries( item ).some( ( [ _key, value ] ) => {
            if ( value === undefined ) return false;

            if ( typeof value === "string" ) {
              return value.toLowerCase().includes( searchText );
            } else if ( typeof value === "number" ) {
              return value.toString().includes( searchText );
            } else if ( typeof value === "boolean" ) {
              if (
                value &&
                ( "true".includes( searchText ) ||
                  "sí".includes( searchText ) ||
                  "si".includes( searchText ) ||
                  "verdadero".includes( searchText ) )
              ) {
                return true;
              }
              if (
                !value &&
                ( "false".includes( searchText ) ||
                  "no".includes( searchText ) ||
                  "falso".includes( searchText ) )
              ) {
                return true;
              }

              return false;
            }

            return false;
          } );
        }
      } );
    }

    return filteredData;
  }, [ initialItems, filterValue, searchFields ] );

  const sortedItems = useMemo( () => {
    if ( !sortDescriptor.column ) return filteredItems;

    return [ ...filteredItems ].sort( ( a, b ) => {
      const first = a[ sortDescriptor.column as keyof T ];
      const second = b[ sortDescriptor.column as keyof T ];

      if ( typeof first === "number" && typeof second === "number" ) {
        return sortDescriptor.direction === "ascending"
          ? first - second
          : second - first;
      } else if ( typeof first === "boolean" && typeof second === "boolean" ) {
        return sortDescriptor.direction === "ascending"
          ? Number( first ) - Number( second )
          : Number( second ) - Number( first );
      } else {
        const firstStr = String( first );
        const secondStr = String( second );
        const cmp = firstStr.localeCompare( secondStr );

        return sortDescriptor.direction === "ascending" ? cmp : -cmp;
      }
    } );
  }, [ sortDescriptor, filteredItems ] );

  const pages = Math.ceil( sortedItems.length / rowsPerPage );

  const items = useMemo( () => {
    const start = ( page - 1 ) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice( start, end );
  }, [ page, sortedItems, rowsPerPage ] );

  const renderCell = useCallback(
    ( item: T, columnKey: string ) => {
      const column = columns.find( ( col ) => col.uid === columnKey );

      if ( column?.renderCell ) {
        return column.renderCell( item, columnKey );
      }

      const value = item[ columnKey as keyof T ];

      if ( typeof value === "boolean" ) {
        return (
          <div className="flex justify-center">
            { value ? (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <Icons.IoCheckmarkOutline className="w-3.5 h-3.5 mr-1" />
                Sí
              </div>
            ) : (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                <Icons.IoCloseOutline className="w-3.5 h-3.5 mr-1" />
                No
              </div>
            ) }
          </div>
        );
      }

      if ( Array.isArray( value ) ) {
        return (
          <div className="flex flex-wrap gap-1">
            { value.map( ( item, index ) => (
              <div
                key={ index }
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                { typeof item === "object" && item !== null
                  ? item.title || item.name || JSON.stringify( item )
                  : String( item ) }
              </div>
            ) ) }
          </div>
        );
      }

      if ( typeof value === "object" && value !== null ) {
        return <p className="text-medium">{ JSON.stringify( value ) }</p>;
      }

      return <p className="text-medium">{ String( value ) }</p>;
    },
    [ columns ],
  );

  const onSearchChange = useCallback( ( value: string ) => {
    if ( value ) {
      setFilterValue( value );
      setPage( 1 );
    } else {
      setFilterValue( "" );
    }
  }, [] );

  const onClear = useCallback( () => {
    setFilterValue( "" );
    setPage( 1 );
    if ( searchInputRef.current ) {
      searchInputRef.current.focus();
    }
  }, [] );

  // Función para manejar el cambio de selección de columnas
  const handleSelectionChange = useCallback( ( keys: any ) => {
    // Asegurarse de que keys es un objeto tipo Set o convertirlo a uno
    if ( typeof keys === "object" && keys !== null ) {
      setVisibleColumns( new Set( Array.from( keys ) ) );
    }
  }, [] );

  const topContent = useMemo( () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            ref={ searchInputRef }
            isClearable
            classNames={ {
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            } }
            placeholder="Buscar..."
            size="sm"
            startContent={
              <Icons.IoSearchOutline className="text-default-300" />
            }
            value={ filterValue }
            onClear={ onClear }
            onValueChange={ onSearchChange }
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
                closeOnSelect={ false }
                selectedKeys={ Array.from( visibleColumns ) }
                selectionMode="multiple"
                onSelectionChange={ handleSelectionChange }
              >
                { columns.map( ( column ) => (
                  <DropdownItem key={ column.uid } className="capitalize">
                    { column.name }
                  </DropdownItem>
                ) ) }
              </DropdownMenu>
            </Dropdown>
            { addButtonComponent ||
              ( onAdd && (
                <Button
                  className="bg-primary text-white"
                  endContent={ <Icons.IoAddOutline /> }
                  size="sm"
                  onPress={ onAdd }
                >
                  { addButtonText }
                </Button>
              ) ) }
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total { filteredItems.length }{ " " }
            { title ? title.toLowerCase() : "elementos" }
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              value={ rowsPerPage }
              onChange={ ( e ) => setRowsPerPage( Number( e.target.value ) ) }
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
    title,
    columns,
    onAdd,
    addButtonText,
    addButtonComponent,
    handleSelectionChange,
  ] );

  const bottomContent = useMemo( () => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={ page }
          total={ pages }
          onChange={ setPage }
        />
      </div>
    );
  }, [ page, pages ] );

  return (
    <div className="w-full">
      <Table
        isHeaderSticky
        aria-label={ title || "Tabla de datos" }
        bottomContent={ bottomContent }
        bottomContentPlacement="outside"
        classNames={ {
          wrapper: "max-h-[600px]",
          base: "min-w-[100%]",
          table: "min-w-[100%]",
        } }
        sortDescriptor={ sortDescriptor as any }
        topContent={ topContent }
        topContentPlacement="outside"
        onSortChange={ setSortDescriptor as any }
      >
        <TableHeader columns={ headerColumns }>
          { ( column: any ) => (
            <TableColumn
              key={ column.uid }
              align={ column.uid === "actions" ? "center" : "start" }
              allowsSorting={ column.sortable }
            >
              { column.name }
            </TableColumn>
          ) }
        </TableHeader>
        <TableBody emptyContent={ noItemsMessage } items={ items }>
          { ( item: any ) => (
            <TableRow key={ ( item[ primaryKey ] as any )?.toString() || "row" }>
              { ( columnKey: any ) => (
                <TableCell>{ renderCell( item, columnKey.toString() ) }</TableCell>
              ) }
            </TableRow>
          ) }
        </TableBody>
      </Table>
    </div>
  );
};