FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.8.0 --activate
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# ACTIVAR YARN 4 TAMBIÉN EN ESTA ETAPA, así nunca tenés problemas
RUN corepack enable && corepack prepare yarn@4.8.0 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000

CMD ["yarn", "start"]
