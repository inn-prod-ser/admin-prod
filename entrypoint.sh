#!/bin/sh

echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" > .env.production
echo "CLERK_SECRET_KEY=${CLERK_SECRET_KEY}" >> .env.production
echo "NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET}" >> .env.production
echo "NEXT_PUBLIC_BACKEND=${NEXT_PUBLIC_BACKEND}" >> .env.production

exec "$@"