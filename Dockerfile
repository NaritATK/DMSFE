# Frontend Dockerfile
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install -g pnpm && pnpm install --prod && pnpm store prune

# Copy built files from builder stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# Expose port
EXPOSE 6849

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:6849/api/health || exit 1

# Start the application
CMD ["pnpm", "start"]
