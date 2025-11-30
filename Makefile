.PHONY: dev dev-frontend dev-backend build build-frontend build-backend preview preview-frontend preview-backend test-e2e

# Frontend
dev-frontend:
	cd frontend && yarn dev

build-frontend:
	cd frontend && yarn build

preview-frontend:
	cd frontend && yarn preview

# Backend(all services)
dev-backend:
	$(MAKE) -C backend dev

build-backend:
	$(MAKE) -C backend build

preview-backend:
	$(MAKE) -C backend run

# Full application (development)
dev:
	@echo "Starting full application..."
	@$(MAKE) dev-backend 2>&1 | sed -u 's/^/backend: /' & \
	$(MAKE) dev-frontend 2>&1 | sed -u 's/^/frontend: /' & \
	wait

# Full application (production build)
build:
	@echo "Building full application..."
	@$(MAKE) build-backend
	@$(MAKE) build-frontend

preview:
	@echo "Running full application..."
	@$(MAKE) preview-backend 2>&1 | sed -u 's/^/backend: /' & \
	$(MAKE) preview-frontend 2>&1 | sed -u 's/^/frontend: /' & \
	wait

# E2E Tests
# Usage: make test-e2e [STAGE=local|production]
# Default: STAGE=local (port 5173)
STAGE ?= local
test-e2e:
	@STAGE=$(STAGE) ./scripts/wait-for-services.sh
	@echo "Running E2E tests..."
	@if [ "$(STAGE)" = "local" ]; then \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:5173 yarn test:e2e; \
	else \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:4173 yarn test:e2e; \
	fi