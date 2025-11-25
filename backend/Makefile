.PHONY: dev dev-task dev-all build build-task build-all run run-task run-all

# task service
dev-task:
	go run cmd/task-service/main.go

build-task:
	go build -o bin/task-service cmd/task-service/main.go

run-task:
	./bin/task-service

# Future services(not implemented)
# dev-user:
#	go run cmd/user-service/main.go
# dev-auth:
#	go run cmd/auth-service/main.go

# All services
dev-all:
	@echo "Starting all backend services..."
	@$(MAKE) dev-task &
	@wait

build-all:
	@echo "Building all backend services..."
	@$(MAKE) build-task

run-all:
	@echo "Running all backend services..."
	@$(MAKE) run-task &
	@wait

# Default: all services
dev: dev-all
build: build-all
run: run-all