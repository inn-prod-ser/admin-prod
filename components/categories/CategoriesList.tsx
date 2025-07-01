"use client";

import {
  CategoriesTableColumns,
  CategoryFormLayout,
  DeleteCategoryModal,
} from "./components";
import { useCategoriesListHelper } from "./helpers";

import { UI } from "@/components/shared";
import { GenericTable } from "@/components/shared/ui";

export const CategoriesList = () => {
  const {
    categories,
    handleDeleteCategory,
    handleEditCategory,
    isDeleteModalOpen,
    isOpen,
    isPending,
    onConfirmDelete,
    onOpenChange,
    selectedCategoryId,
    setIsDeleteModalOpen,
    categoryTitle,
  } = useCategoriesListHelper();

  return (
    <div className="categories-list">
      <div className="categories-list__container">
        <UI.Card>
          <UI.CardBody>
            <GenericTable
              addButtonComponent={<CategoryFormLayout name="categoría" />}
              addButtonText="Agregar Categoría"
              columns={CategoriesTableColumns({
                onEdit: handleEditCategory,
                onDelete: handleDeleteCategory,
              })}
              initialRowsPerPage={5}
              initialSortColumn="title"
              initialSortDirection="ascending"
              initialVisibleColumns={[
                "title",
                "slug",
                "visible",
                "creationDate",
                "createdBy",
                "actions",
              ]}
              items={categories || []}
              noItemsMessage="No se encontraron categorías"
              primaryKey="id"
              searchFields={["title", "slug"]}
              title="Categorías"
              onAdd={() => {}}
            />
          </UI.CardBody>
        </UI.Card>
      </div>

      {isOpen && (
        <CategoryFormLayout
          id={selectedCategoryId}
          isOpen={isOpen}
          name="categoría"
          onOpenChange={onOpenChange}
        />
      )}

      <DeleteCategoryModal
        categoryTitle={categoryTitle || ""}
        isOpen={isDeleteModalOpen}
        isPending={isPending}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
