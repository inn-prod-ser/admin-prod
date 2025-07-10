# Usamos la imagen base completa de Node.js
FROM node:20

# Habilitamos Corepack para usar la versión de Yarn de tu proyecto
RUN corepack enable

# Añadimos el directorio de binarios de yarn al PATH del sistema
ENV PATH /root/.yarn/bin:$PATH

WORKDIR /app

COPY package.json yarn.lock ./

# Instalamos las dependencias. Ahora encontrará el 'yarn' correcto gracias al PATH
RUN yarn install --immutable

COPY . .

# Pasamos los argumentos de build
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Construimos la aplicación. Ahora encontrará 'next' porque las dependencias están bien instaladas
RUN yarn build

# Exponemos el puerto
EXPOSE 3000

# El comando para arrancar la aplicación
CMD ["yarn", "start"]