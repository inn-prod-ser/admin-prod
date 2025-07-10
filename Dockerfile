FROM node:20 AS builder

WORKDIR /app

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_BACKEND

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_JWT_SECRET=$NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND
ENV YARN_NODE_LINKER=node-modules

COPY .env.local .env.local
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
RUN yarn install --immutable
COPY . .
RUN yarn build

FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV YARN_NODE_LINKER=node-modules

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000
CMD ["yarn", "start"]
