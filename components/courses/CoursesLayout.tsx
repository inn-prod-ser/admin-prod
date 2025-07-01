import { PageView } from "../layouts";

import { CoursesList } from "./components";

export const CoursesLayout = () => {
  return (
    <PageView
      content={<CoursesList />}
      imageUrl="https://i.imgur.com/8YBblfk.png"
      subtitle="Administra y edita los cursos en esta sección"
      title="Panel de Cursos"
    />
  );
};
