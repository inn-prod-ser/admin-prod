# ETAPA 1: BUILDER
FROM node:20 AS builder
WORKDIR /app

# Argumentos que se reciben en el build
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

# Convertir los ARG a ENV para que 'yarn build' los vea
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# El resto de variables no son necesarias para el build
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_BACKEND
ARG APP_VERSION
ENV NEXT_PUBLIC_JWT_SECRET=$NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

ENV YARN_NODE_LINKER=node-modules

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
RUN yarn install --immutable

COPY . .
RUN yarn build

# ETAPA 2: RUNNER (PRODUCCIÓN)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiamos los artefactos de build y las dependencias
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000

# El comando 'yarn start' (que ejecuta 'next start') leerá las variables de entorno
# que le pases con 'docker run -e'
CMD ["yarn", "start"]