FROM node:20-alpine

WORKDIR /app

# 1. Copiamos los archivos de manifiesto
COPY package.json yarn.lock ./

# 2. Habilitamos la versión correcta de Yarn
RUN corepack enable

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

# 7. Exponemos el puerto
EXPOSE 3000

# 8. El comando final que leerá las variables de 'docker run'
CMD ["yarn", "start"]