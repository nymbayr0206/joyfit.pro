#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Set it in .env and load via docker-compose env_file."
  exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting Next.js..."
exec npm run start
