"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";

import { useCategoriesFormHelper } from "../helpers";
import { useGetCategory } from "../hooks";

import { CategoryInputs, categorySchema, UI } from "@/components";
import { Icons } from "@/components/shared/ui";

interface Props {
  id?: string;
  onClose: () => void;
}

export const CategoryForm = ({ id, onClose }: Props) => {
  const form = useForm<CategoryInputs>({
    defaultValues: { title: "", visible: false },
    mode: "onSubmit",
    resolver: zodResolver(categorySchema),
  });

  const { handleSave, validateUniqueTitle, existingTitles } =
    useCategoriesFormHelper(id, form);
  const { category } = useGetCategory(id || "");

  useEffect(() => {
    if (id && category) {
      form.reset({ title: category.title, visible: category.visible });
    }
  }, [id, category, form]);

  const onSubmit = async (data: CategoryInputs) => {
    try {
      await handleSave(
        {
          title: data.title,
          visible: id ? data.visible : false,
        },
        onClose,
      );

      addToast({
        title: "Éxito",
        description: id
          ? `La categoría "${data.title}" se ha actualizado correctamente.`
          : `La categoría "${data.title}" se ha creado correctamente.`,
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: `Hubo un problema al guardar la categoría "${data.title}".`,
        color: "danger",
      });
    }
  };

  return (
    <UI.Form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <UI.Input
            {...field}
            errorMessage={
              form.formState.errors.title?.message ||
              (existingTitles.includes(field.value.toLowerCase())
                ? "Esta categoría ya existe."
                : undefined)
            }
            isInvalid={
              Boolean(form.formState.errors.title) ||
              existingTitles.includes(field.value.toLowerCase())
            }
            label="Título"
            labelPlacement="outside"
            placeholder="Ingresa un título"
            onValueChange={(value) => {
              field.onChange(value);
              validateUniqueTitle(value);
            }}
          />
        )}
      />

      {id && (
        <Controller
          control={form.control}
          name="visible"
          render={({ field: { value, onChange } }) => (
            <UI.Switch
              color={value ? "success" : "danger"}
              isSelected={value}
              size="lg"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <Icons.IoEyeOutline className={className} />
                ) : (
                  <Icons.IoEyeOffOutline className={className} />
                )
              }
              onValueChange={(checked) => onChange(checked)}
            >
              {value ? "Categoría visible" : "Categoría invisible"}
            </UI.Switch>
          )}
        />
      )}
    </UI.Form>
  );
};
