import { PageView } from "./";

export const ContactLayout = () => {
  return (
    <PageView
      content={
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Centro de Contacto</h2>
          <p className="text-gray-600">
            Administra los mensajes y solicitudes de contacto de los usuarios.
          </p>
        </div>
      }
      imageUrl="https://i.imgur.com/ODZmoSU.png"
      subtitle="Revisa y gestiona los mensajes entrantes"
      title="Panel de Contacto"
    />
  );
};
