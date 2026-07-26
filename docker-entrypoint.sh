#!/bin/sh
set -e

echo "▶ Initializing database (migrations + seed)…"
node prisma/init-db.js

echo "▶ Starting Next.js on :${PORT:-3000}…"
exec node server.js
