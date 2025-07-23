FROM node:20.12.2-alpine AS builder

WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BACKEND

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BACKEND=$NEXT_PUBLIC_BACKEND

RUN corepack enable && corepack prepare yarn@4.8.0 --activate
RUN yarn config set nodeLinker node-modules
RUN yarn install --immutable --mode=skip-build
RUN yarn build

FROM node:20.12.2-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV=production
ENV PORT=3010

EXPOSE 3010

CMD ["yarn", "start"]
