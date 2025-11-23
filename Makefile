.PHONY: dev dev-frontend dev-backend build build-frontend build-backend run run-frontend run-backend test-e2e

# Frontend
dev-frontend:
	cd frontend && yarn dev

build-frontend:
	cd frontend && yarn build

run-frontend:
	cd frontend && yarn preview

# Backend(all services)
dev-backend:
	$(MAKE) -C backend dev

build-backend:
	$(MAKE) -C backend build

run-backend:
	$(MAKE) -C backend run

# Full application (development)
dev:
	@echo "Starting full application..."
	@$(MAKE) dev-backend 2>&1 | sed -u 's/^/backend: /' &
	@$(MAKE) dev-frontend 2>&1 | sed -u 's/^/frontend: /' &
	@wait

# Full application (production build)
build:
	@echo "Building full application..."
	@$(MAKE) build-backend
	@$(MAKE) build-frontend

run:
	@echo "Running full application..."
	@$(MAKE) run-backend 2>&1 | sed -u 's/^/backend: /' &
	@$(MAKE) run-frontend 2>&1 | sed -u 's/^/frontend: /' &
	@wait

# E2E Tests
# Usage: make test-e2e [STAGE=local|production]
# Default: STAGE=local (port 5173)
STAGE ?= local
test-e2e:
	@STAGE=$(STAGE) ./scripts/wait-for-services.sh
	@echo "Running E2E tests..."
	cd frontend && yarn test:e2e