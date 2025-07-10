export type CategoryStatus = "published" | "hidden" | "deleted";

export interface CategoriesMenuTabOptions {
  key: string;
  label: string;
  icon: JSX.Element;
  status: CategoryStatus;
}
