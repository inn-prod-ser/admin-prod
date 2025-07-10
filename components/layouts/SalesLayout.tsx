import { PageView } from ".";

export const SalesLayout = () => {
  return (
    <PageView
      content={
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Resumen de Ventas</h2>
          <p className="text-gray-600">
            Consulta el estado de las ventas, facturación y tendencias del
            mercado.
          </p>
        </div>
      }
      imageUrl="https://i.imgur.com/XRs17cF.png"
      subtitle="Monitorea las ventas y el rendimiento financiero"
      title="Panel de Ventas"
    />
  );
};
