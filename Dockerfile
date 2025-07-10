FROM node:20-alpine

WORKDIR /app

# Esta es la línea mágica que faltaba.
# Le dice a la shell dónde buscar los comandos de Yarn.
ENV PATH /root/.yarn/bin:$PATH

# 1. Copiamos los archivos de manifiesto
COPY package.json yarn.lock ./

# 2. Habilitamos y preparamos la versión correcta de Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# 3. Instalamos TODAS las dependencias (producción y desarrollo)
RUN yarn install

# 4. Copiamos el resto del código fuente
COPY . .

# 5. Pasamos los argumentos de build como variables de entorno
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# 6. Construimos la aplicación de Next.js
RUN yarn build

# 7. Preparamos para producción, eliminando dependencias de desarrollo
RUN yarn install --production

# 8. Exponemos el puerto
EXPOSE 3000

# 9. El comando final
CMD ["yarn", "start"]