import { Button } from "@heroui/react";

import { CustomToast } from "./CustomToast";

export const CustomToastExample = () => {
  const showSuccessToast = () => {
    return (
      <CustomToast
        description="Los datos se han guardado correctamente"
        shouldShowTimeoutProgress={true}
        timeout={3000}
        title="Operación exitosa"
        variant="flat"
      />
    );
  };

  const showErrorToast = () => {
    return (
      <CustomToast
        description="No se pudo completar la operación"
        icon={
          <svg height={24} viewBox="0 0 24 24" width={24}>
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
              strokeWidth={1.5}
            >
              <path d="M12 9v5M12 21.41H5.94c-3.47 0-4.92-2.48-3.24-5.51l3.12-5.62L8.76 5c1.78-3.21 4.7-3.21 6.48 0l2.94 5.29 3.12 5.62c1.68 3.03.22 5.51-3.24 5.51H12v-.01z" />
              <path d="M11.995 17h.009" />
            </g>
          </svg>
        }
        timeout={5000}
        title="Error"
        variant="solid"
      />
    );
  };

  const showCustomToast = () => {
    return (
      <CustomToast
        description="Esta es una notificación con contenido adicional"
        endContent={
          <Button size="sm" variant="flat">
            Aceptar
          </Button>
        }
        title="Notificación personalizada"
        variant="bordered"
      />
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="flat" onPress={showSuccessToast}>
        Mostrar éxito
      </Button>

      <Button variant="flat" onPress={showErrorToast}>
        Mostrar error
      </Button>

      <Button variant="flat" onPress={showCustomToast}>
        Notificación con botón
      </Button>

      <Button
        variant="flat"
        onPress={() => {
          return (
            <CustomToast
              description="Espere mientras procesamos su solicitud..."
              promise={new Promise((resolve) => setTimeout(resolve, 3000))}
              title="Notificación con promesa"
            />
          );
        }}
      >
        Notificación con promesa
      </Button>
    </div>
  );
};
