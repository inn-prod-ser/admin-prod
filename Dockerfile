FROM node:20-alpine

# 1. ACTUALIZAMOS EL GESTOR DE PAQUETES Y DESINSTALAMOS YARN v1
RUN apk update && apk del yarn

# 2. HABILITAMOS COREPACK. AHORA NO TIENE CONFLICTOS.
RUN corepack enable

WORKDIR /app

# 3. Copiamos los archivos de manifiesto
COPY package.json yarn.lock ./

# 4. Instalamos TODAS las dependencias. Ahora usará Yarn v4 sí o sí.
RUN yarn install

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Pasamos los argumentos de build como variables de entorno
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# 7. Construimos la aplicación de Next.js
RUN yarn build

# 8. Preparamos para producción, eliminando dependencias de desarrollo
RUN yarn install --production

# 9. Exponemos el puerto
EXPOSE 3000

# 10. El comando final. Usará el Yarn v4 de Corepack.
CMD ["yarn", "start"]