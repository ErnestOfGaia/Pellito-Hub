#!/bin/sh
set -e

echo "▶ Pushing Drizzle schema to DB..."
./node_modules/.bin/drizzle-kit push

echo "▶ Starting Pellito Hub..."
exec node server.js
