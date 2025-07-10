# Usamos la imagen base completa de Node.js, no Alpine. Es más grande pero 100% compatible.
FROM node:20

# Habilitamos Corepack para usar la versión de Yarn de tu proyecto.
RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

# Instalamos las dependencias. En esta imagen, Corepack funciona como se espera.
RUN yarn install --immutable

COPY . .

# Pasamos los argumentos de build.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Construimos la aplicación.
RUN yarn build

# Exponemos el puerto
EXPOSE 3000

# El comando para arrancar la aplicación en producción.
CMD ["yarn", "start"]