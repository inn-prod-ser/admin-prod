import { useState } from "react";
import { addToast } from "@heroui/react";

import { useDeleteCategory, useGetCategories } from "../hooks";

import { UI } from "@/components/shared";

export const useCategoriesListHelper = () => {
  const { categories, refetch } = useGetCategories();
  const { deleteCategoryById, isPending } = useDeleteCategory();
  const { isOpen, onOpen, onOpenChange } = UI.useDisclosure();

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [categoryToDelete, setCategoryToDelete] = useState<string | undefined>(
    undefined,
  );
  const [categoryTitle, setCategoryTitle] = useState<string | undefined>(
    undefined,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditCategory = (id: string) => {
    setSelectedCategoryId(id);
    onOpen();
  };

  const handleDeleteCategory = (id: string, title: string) => {
    setCategoryToDelete(id);
    setCategoryTitle(title);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!categoryToDelete || !categoryTitle) return;

    try {
      await deleteCategoryById(categoryToDelete);
      await refetch();

      addToast({
        title: "Éxito",
        description: `La categoría "${categoryTitle}" ha sido eliminada correctamente.`,
        color: "success",
      });

      setIsDeleteModalOpen(false);
      setCategoryToDelete(undefined);
      setCategoryTitle(undefined);
    } catch (error) {
      addToast({
        title: "Error",
        description: `Hubo un problema al eliminar la categoría "${categoryTitle}".`,
        color: "danger",
      });
    }
  };

  return {
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
  };
};
