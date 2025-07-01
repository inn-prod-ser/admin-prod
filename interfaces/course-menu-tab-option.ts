export type CourseStatus = "published" | "hidden" | "deleted";

export interface CourseMenuTabOption {
  key: string;
  label: string;
  icon: JSX.Element;
  status: CourseStatus;
}
