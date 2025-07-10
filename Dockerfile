FROM node:20-alpine AS builder

WORKDIR /app

ENV YARN_NODE_LINKER=node-modules

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.8.0 --activate
RUN yarn install --immutable

COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV YARN_NODE_LINKER=node-modules

# ✅ ACTIVÁ Corepack y Yarn 4 en el contenedor de ejecución
RUN corepack enable && corepack prepare yarn@4.8.0 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000

CMD ["yarn", "start"]
