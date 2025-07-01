import { PageView } from ".";

export const UsersLayout = () => {
  return (
    <PageView
      content={
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
          <p className="text-gray-600">
            Administra los usuarios registrados en la plataforma y gestiona sus
            permisos.
          </p>
        </div>
      }
      imageUrl="https://i.imgur.com/xdgcsQ3.png"
      subtitle="Controla y administra los usuarios de la plataforma"
      title="Panel de Usuarios"
    />
  );
};
