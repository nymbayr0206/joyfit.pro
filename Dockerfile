# Joyfit – Next.js 16 + Prisma on Node 20 (VPS)
# Multi-stage: builder then runner

FROM node:20-alpine AS builder

WORKDIR /app

# Install deps (frozen lockfile)
COPY package.json package-lock.json ./
RUN npm ci

# Prisma + app source
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# Build Next.js
RUN npm run build

# --- Runner stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy app artifacts
COPY --from=builder /app/.next   ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Entrypoint: migrate then start
COPY docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker/entrypoint.sh"]
