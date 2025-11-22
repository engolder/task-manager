#!/bin/sh

# Wait for services to be ready before running E2E tests
# Usage: ./scripts/wait-for-services.sh

set -e

BACKEND_PORT=8080
FRONTEND_PORT=5173
MAX_RETRIES=5
RETRY_INTERVAL=1

echo "Waiting for services to be ready..."

# Wait for backend
for i in $(seq 1 $MAX_RETRIES); do
  if lsof -i:$BACKEND_PORT > /dev/null 2>&1; then
    echo "✅ Backend is ready on port $BACKEND_PORT"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "❌ Backend is not running on port $BACKEND_PORT"
    echo "   Timeout after ${MAX_RETRIES}s"
    echo "   Please run 'make dev-backend' first"
    exit 1
  fi
  echo "⏳ Waiting for backend... ($i/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

# Wait for frontend
for i in $(seq 1 $MAX_RETRIES); do
  if lsof -i:$FRONTEND_PORT > /dev/null 2>&1; then
    echo "✅ Frontend is ready on port $FRONTEND_PORT"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "❌ Frontend is not running on port $FRONTEND_PORT"
    echo "   Timeout after ${MAX_RETRIES}s"
    echo "   Please run 'make dev-frontend' first"
    exit 1
  fi
  echo "⏳ Waiting for frontend... ($i/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

echo "✅ All services are ready"
