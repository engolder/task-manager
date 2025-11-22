.PHONY: dev dev-frontend dev-backend test-e2e

# Frontend
dev-frontend:
	cd frontend && yarn dev

# Backend(all services)
dev-backend:
	$(MAKE) -C backend dev

# Full application
dev:
	@echo "Starting full application..."
	@$(MAKE) dev-backend 2>&1 | sed 's/^/backend: /' &
	@$(MAKE) dev-frontend 2>&1 | sed 's/^/frontend: /' &
	@wait

# E2E Tests
test-e2e:
	@./scripts/wait-for-services.sh
	@echo "Running E2E tests..."
	cd frontend && yarn test:e2e