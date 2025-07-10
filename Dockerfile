FROM node:20-alpine

WORKDIR /app

# 1. Copiamos los archivos de manifiesto
COPY package.json yarn.lock ./

# 2. Habilitamos y preparamos la versión correcta de Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# 3. Instalamos TODAS las dependencias (producción y desarrollo)
#    Usamos 'yarn dlx' para forzar la versión correcta de yarn
RUN yarn dlx -p yarn@4.9.2 yarn install

# 4. Copiamos el resto del código fuente
COPY . .

# 5. Pasamos los argumentos de build como variables de entorno
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# 6. Construimos la aplicación de Next.js
#    De nuevo, 'yarn dlx' para forzar la versión correcta
RUN yarn dlx -p yarn@4.9.2 yarn build

# 7. Preparamos para producción, eliminando dependencias de desarrollo
RUN yarn dlx -p yarn@4.9.2 yarn install --production

# 8. Exponemos el puerto
EXPOSE 3000

# 9. El comando final, forzando la versión correcta una última vez
CMD ["yarn", "dlx", "-p", "yarn@4.9.2", "yarn", "start"]