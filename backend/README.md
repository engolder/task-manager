# Backend

Go backend service with Clean Architecture and Domain-Driven Design.

## 🎯 Tech Stack

- **Language**: Go 1.23+
- **Web Framework**: Gin (HTTP routing, middleware)
- **ORM**: GORM (type-safe database access)
- **Database**: SQLite (dev), PostgreSQL (prod-ready)
- **Architecture**: Clean Architecture + Domain-Driven Design (DDD)
- **Dependency Injection**: Uber Fx (automated DI, lifecycle management)
- **HTTP Client**: Built-in net/http
- **UUID**: Google UUID library

## 📁 Project Structure

```
backend/
├── cmd/
│   └── task-service/
│       └── main.go              # Fx module composition
├── pkg/                         # Public interfaces
│   ├── http/
│   │   └── server.go           # HTTPServer interface
│   └── config/
│       ├── config.go
│       └── module.go
├── internal/
│   ├── domain/                  # Business models
│   │   └── task/
│   │       ├── entity.go        # Task entity
│   │       └── repository.go    # Repository interface
│   ├── usecase/                 # Business logic
│   │   └── task/
│   │       ├── usecase.go
│   │       └── module.go
│   ├── infrastructure/          # External dependencies
│   │   ├── database/
│   │   │   ├── database.go     # DB connection
│   │   │   └── module.go
│   │   ├── persistence/         # Repository implementations
│   │   │   └── task/
│   │   │       ├── repository.go
│   │   │       └── module.go
│   │   └── http/
│   │       ├── server.go       # Gin server
│   │       └── module.go
│   └── controller/              # External interfaces
│       └── http/
│           └── task/
│               ├── handler.go
│               ├── router.go
│               └── module.go
├── go.mod
├── go.sum
└── data/tasks.db
```

## 🏗️ Clean Architecture Layers

### 1. Domain Layer (`internal/domain/task/`)
- **Responsibility**: Pure business models and rules
- **Characteristics**: No external dependencies, framework-independent
- **Files**:
  - `entity.go`: Task entity, business rules
  - `repository.go`: Repository interface (contract)

### 2. UseCase Layer (`internal/usecase/task/`)
- **Responsibility**: Business logic orchestration, use case implementation
- **Characteristics**: Depends on Domain interfaces only
- **Files**:
  - `usecase.go`: Task business logic, input validation
  - `module.go`: Fx module definition

### 3. Infrastructure Layer (`internal/infrastructure/`)
- **Responsibility**: External system integration (DB, HTTP server, external APIs)
- **Characteristics**: Implements Domain interfaces, framework-dependent
- **Subdirectories**:
  - `database/`: GORM database connection with lifecycle management
  - `persistence/task/`: TaskRepository implementation
  - `http/`: Gin server with CORS, health checks

### 4. Controller Layer (`internal/controller/http/task/`)
- **Responsibility**: HTTP request/response handling
- **Characteristics**: Uses pkg/http.HTTPServer interface (not Infrastructure directly)
- **Files**:
  - `handler.go`: HTTP handlers
  - `router.go`: Route registration
  - `module.go`: Fx module with auto-invoked RegisterRoutes

## 🔄 Dependency Injection with Fx

Module-based dependency injection using Uber Fx. See [CLAUDE.md](CLAUDE.md) for implementation patterns.

## 🚀 Development

### Prerequisites
- Go 1.23+

### Installation

```bash
# Install dependencies
go mod download
```

### Available Commands

```bash
# Run development server
go run cmd/task-service/main.go

# Build binary
go build -o bin/task-service cmd/task-service/main.go

# Run binary
./bin/task-service

# Run tests
go test ./...

# Check dependencies
go mod tidy
```

### Environment Variables

- `PORT`: Server port (default: 8080)
- `DB_PATH`: SQLite database path (default: ./tasks.db)
- `PHASE`: Environment phase (debug/release) - affects CORS

### CORS Configuration

**Debug mode** (`PHASE=debug`):
```bash
PHASE=debug go run cmd/task-service/main.go
```
- Allows all origins (for iOS live reload)
- Ideal for local network development

**Release mode** (`PHASE=release` or unset):
```bash
PHASE=release ./bin/task-service
```
- Restricted to specific origins:
  - `localhost:5173`, `localhost:5174` (Vite dev)
  - `localhost:4173`, `localhost:4173` (Vite preview)

## 📡 API

### Endpoints
- **Health Checks**: `/health`, `/ready`
- **Task API**: `/api/v1/tasks` - RESTful CRUD operations
- **API Format**: JSON request/response

### Testing API
```bash
# Check service health
curl http://localhost:8080/health

# Explore API endpoints
# See internal/interfaces/router.go for complete endpoint definitions
```

## 📊 Architecture

### Independence
- **Database isolation**: Each service has its own DB
- **Service-specific entrypoint**: `cmd/{service-name}/` structure
- **Externalized configuration**: Environment variable-based config

### Communication Patterns
- **RESTful API**: HTTP communication between services
- **Health Checks**: Service discovery support
- **API Versioning**: `/api/v1/` format for backward compatibility

### Observability
- **Structured Logging**: JSON format logs (planned)
- **Metrics Collection**: Prometheus integration (planned)
- **Distributed Tracing**: Request ID propagation (planned)

## 📚 References

- [Go Documentation](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [GORM ORM Library](https://gorm.io/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📖 Additional Documentation

- **Architecture Guide**: [CLAUDE.md](CLAUDE.md)
