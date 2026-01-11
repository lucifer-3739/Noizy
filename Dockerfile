# =========================
# Base
# =========================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# =========================
# Dependencies
# =========================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Builder
# =========================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Mock environment variables to satisfy build-time checks (if any)
# These are overwritten by docker-compose at runtime
ENV DATABASE_URL="postgresql://mock:mock@localhost:5432/mock"
ENV MINIO_ENDPOINT="localhost"
ENV MINIO_PORT="9000"
ENV MINIO_ACCESS_KEY="mock"
ENV MINIO_SECRET_KEY="mock"
ENV MINIO_BUCKET="mock"

RUN npm run build

# =========================
# Runner (Production)
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copy only what is needed
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
