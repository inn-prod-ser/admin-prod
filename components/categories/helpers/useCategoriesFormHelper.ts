import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  useAddCategory,
  useGetCategories,
  useGetCategory,
  useUpdateCategory,
} from "../hooks";

import { CategoryInputs } from "@/components";

const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim()
    .toLowerCase();

export const useCategoriesFormHelper = (
  id: string | undefined,
  form: UseFormReturn<CategoryInputs>,
) => {
  const { addNewCategory } = useAddCategory();
  const { categoryUpdate } = useUpdateCategory();
  const { category } = useGetCategory(id || "");
  const { categories = [] } = useGetCategories();

  const existingTitles = useMemo(
    () =>
      categories
        .filter((cat) => (id ? cat.id !== id : true))
        .map((cat) => normalizeString(cat.title)),
    [categories, id],
  );

  useEffect(() => {
    form.reset({ title: category?.title ?? "" });
  }, [category, form]);

  const validateUniqueTitle = (value: string) => {
    const normalizedInput = normalizeString(value);

    return existingTitles.includes(normalizedInput)
      ? "Esta categoría ya existe."
      : true;
  };

  const handleSave = async (data: CategoryInputs, onClose: () => void) => {
    await (id ? categoryUpdate(data, id) : addNewCategory(data));
    onClose();
  };

  return {
    handleSave,
    validateUniqueTitle,
    existingTitles,
  };
};
