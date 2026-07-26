# syntax=docker/dockerfile:1.7
# ──────────────────────────────────────────────────────────────────────────
# KuberaNow — minimal multi-stage Dockerfile (final image ~150-200MB)
# Uses Next.js standalone output so the runtime image needs NO node_modules.
# ──────────────────────────────────────────────────────────────────────────

# ── Stage 1: deps ──────────────────────────────────────────────────────────
# Install ALL deps + compile better-sqlite3's native bindings against musl.
FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++ libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# prisma.config.ts calls env("DATABASE_URL"); give it a placeholder so it loads.
ENV DATABASE_URL="file:./prisma/dev.db"

RUN npm ci --include=dev \
 && npx prisma generate

# ── Stage 2: builder ───────────────────────────────────────────────────────
# Build the Next.js app. Output: .next/standalone
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Env values needed by both prisma.config.ts and next build
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true
ENV DATABASE_URL="file:./prisma/dev.db"
ENV AUTH_SECRET="build-time-placeholder"
ENV AUTH_TRUST_HOST=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build \
 && npx --yes esbuild prisma/seed.ts --bundle --platform=node --format=cjs \
    --outfile=prisma/seed.compiled.js --external:@prisma/client \
    --external:@prisma/adapter-better-sqlite3 --external:better-sqlite3

# ── Stage 3: runner (tiny final image) ─────────────────────────────────────
FROM node:22-alpine AS runner
# better-sqlite3 needs libstdc++ at runtime; libc6-compat for musl/glibc compat
RUN apk add --no-cache libstdc++ libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next standalone server. The standalone build bundles its own minimal
# node_modules (only the runtime deps Next.js needs) — no full node_modules here.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Prisma runtime (for the app's queries at request time).
# We use a tiny direct-better-sqlite3 initializer (prisma/init-db.js) instead
# of the Prisma CLI, so the entire CLI toolchain stays out of the image.
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma/seed.compiled.js ./prisma/seed.compiled.js

# Prisma generated client + the SQLite driver adapter + its native module.
# These live outside the standalone bundle so we copy them explicitly.
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=node:node /app/node_modules/@prisma/client-runtime-utils ./node_modules/@prisma/client-runtime-utils
COPY --from=builder --chown=node:node /app/node_modules/@prisma/adapter-better-sqlite3 ./node_modules/@prisma/adapter-better-sqlite3
COPY --from=builder --chown=node:node /app/node_modules/@prisma/driver-adapter-utils ./node_modules/@prisma/driver-adapter-utils
COPY --from=builder --chown=node:node /app/node_modules/@prisma/debug ./node_modules/@prisma/debug
COPY --from=builder --chown=node:node /app/node_modules/@prisma/engines-version ./node_modules/@prisma/engines-version
COPY --from=builder --chown=node:node /app/node_modules/@prisma/get-platform ./node_modules/@prisma/get-platform
COPY --from=builder --chown=node:node /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder --chown=node:node /app/node_modules/bindings ./node_modules/bindings
COPY --from=builder --chown=node:node /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path
# bcryptjs (used by auth.ts + seed)
COPY --from=builder --chown=node:node /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Strip unused WASM query-compiler bundles (keep only sqlite) — reclaims ~60MB.
RUN find node_modules/@prisma/client/runtime -type f \( -name '*cockroach*' -o -name '*mysql*' -o -name '*postgresql*' -o -name '*sqlserver*' -o -name '*mongodb*' \) -delete

# Entrypoint: init the DB (migrations + seed via plain better-sqlite3), then
# start the Next.js standalone server.
COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Persistent data dir (mount a named volume here in docker-compose).
# Must exist + be writable by the node user before the entrypoint runs.
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME ["/app/data"]

USER node
EXPOSE 3000

CMD ["docker-entrypoint.sh"]
