.PHONY: init init-frontend init-backend dev dev-frontend dev-backend watch-ios build build-frontend build-backend preview preview-frontend preview-backend test-e2e

# Initialize dependencies
init-frontend:
	cd frontend && yarn install

init-backend:
	cd backend && go mod download

init:
	@echo "Installing dependencies..."
	@$(MAKE) init-frontend
	@$(MAKE) init-backend
	@echo "✅ All dependencies installed"

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

# iOS simulator
watch-ios:
	cd frontend && yarn ios:dev

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
# Usage: make test-e2e [PHASE=debug|release]
# Default: PHASE=debug (port 5173)
PHASE ?= debug
test-e2e:
	@PHASE=$(PHASE) ./scripts/wait-for-services.sh
	@echo "Running E2E tests..."
	@if [ "$(PHASE)" = "debug" ]; then \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:5173 yarn test:e2e; \
	else \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:4173 yarn test:e2e; \
	fi