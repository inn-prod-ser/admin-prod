
import { InstructorsList, PageView } from "@/components";

export const InstructorsLayout = () => {
  return (
    <PageView
      content={<InstructorsList />}
      imageUrl="https://i.imgur.com/ZYTwu3z.png"
      subtitle="Administra y edita la información de los instructores en esta sección."
      title="Panel de Instructores"
    />
  );
};
