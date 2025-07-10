# Usamos la imagen base completa de Node.js, no Alpine.
FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

# Instalamos las dependencias. Forzamos corepack aquí.
RUN corepack enable && yarn install --immutable

COPY . .

# Pasamos los argumentos de build.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Construimos la aplicación. VOLVEMOS A FORZAR COREPACK.
RUN corepack enable && yarn build

# Exponemos el puerto
EXPOSE 3000

# El comando para arrancar.
# El CMD final no necesita 'corepack enable' porque ya estará todo construido.
CMD ["yarn", "start"]