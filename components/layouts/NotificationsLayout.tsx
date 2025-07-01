import { PageView } from ".";

export const NotificationsLayout = () => {
  return (
    <PageView
      content={
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Centro de Notificaciones</h2>
          <p className="text-gray-600">
            Gestiona y visualiza todas las notificaciones enviadas a los
            usuarios.
          </p>
        </div>
      }
      imageUrl="https://i.imgur.com/WMJ5UdB.png"
      subtitle="Administra las notificaciones y alertas del sistema"
      title="Panel de Notificaciones"
    />
  );
};
