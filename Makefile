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
	@$(MAKE) dev-backend &
	@$(MAKE) dev-frontend &
	@wait

# E2E Tests
test-e2e:
	@echo "Running E2E tests..."
	cd frontend && yarn test:e2e