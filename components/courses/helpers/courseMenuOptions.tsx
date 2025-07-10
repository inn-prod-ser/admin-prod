import { Icons } from "@/components/shared/ui";
import { CourseMenuTabOption } from "@/interfaces";

export const getCourseMenuOptions = (): CourseMenuTabOption[] => {
  return [
    {
      key: "publicados",
      icon: <Icons.IoEyeOutline size={20} />,
      label: "Publicados",
      status: "published",
    },
    {
      key: "ocultos",
      icon: <Icons.IoEyeOffOutline size={20} />,
      label: "Borradores",
      status: "hidden",
    },
    {
      key: "eliminados",
      icon: <Icons.IoTrashOutline size={20} />,
      label: "Eliminados",
      status: "deleted",
    },
  ];
};
