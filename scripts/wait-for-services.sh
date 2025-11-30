#!/bin/sh

# Wait for services to be ready before running E2E tests
# Usage: ./scripts/wait-for-services.sh

set -e

BACKEND_PORT=8080
MAX_RETRIES=10
RETRY_INTERVAL=1

# Determine frontend port based on PHASE
PHASE=${PHASE:-debug}
if [ "$PHASE" = "debug" ]; then
  FRONTEND_PORT=5173
else
  FRONTEND_PORT=4173
fi

echo "Waiting for services to be ready... (PHASE=$PHASE)"

# Wait for backend
for i in $(seq 1 $MAX_RETRIES); do
  if lsof -i:$BACKEND_PORT > /dev/null 2>&1; then
    printf "\r\033[K✅ Backend is ready on port $BACKEND_PORT\n"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    printf "\r\033[K❌ Backend is not running on port $BACKEND_PORT\n"
    echo "   Timeout after ${MAX_RETRIES}s"
    echo "   Please run 'make dev-backend' first"
    exit 1
  fi
  printf "\r⏳ Waiting for backend... (%d/%d)" "$i" "$MAX_RETRIES"
  sleep $RETRY_INTERVAL
done

# Wait for frontend
for i in $(seq 1 $MAX_RETRIES); do
  if lsof -i:$FRONTEND_PORT > /dev/null 2>&1; then
    printf "\r\033[K✅ Frontend is ready on port $FRONTEND_PORT\n"
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    printf "\r\033[K❌ Frontend is not running on port $FRONTEND_PORT\n"
    echo "   Timeout after ${MAX_RETRIES}s"
    echo "   Please run 'make dev-frontend' or 'make run-frontend' first"
    exit 1
  fi
  printf "\r⏳ Waiting for frontend... (%d/%d)" "$i" "$MAX_RETRIES"
  sleep $RETRY_INTERVAL
done

echo "✅ All services are ready"
