import { PageView } from ".";

export const CompaniesLayout = () => {
  return (
    <PageView
      content={
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Empresas Registradas</h2>
          <p className="text-gray-600">
            Gestiona la información de las empresas asociadas en la plataforma.
          </p>
        </div>
      }
      imageUrl="https://i.imgur.com/r85Wz7s.png"
      subtitle="Administra los datos de las empresas registradas"
      title="Panel de Empresas"
    />
  );
};
