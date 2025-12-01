# Backend

Go backend service with Clean Architecture and Domain-Driven Design.

## 🎯 Tech Stack

- **Language**: Go 1.23+
- **Web Framework**: Gin (HTTP routing, middleware)
- **ORM**: GORM (type-safe database access)
- **Database**: SQLite (dev), PostgreSQL (prod-ready)
- **Architecture**: Clean Architecture + Domain-Driven Design (DDD)
- **HTTP Client**: Built-in net/http
- **UUID**: Google UUID library

## 📁 Project Structure

```
backend/
├── cmd/
│   └── task-service/        # Service entrypoint
│       └── main.go          # Main executable
├── internal/                # Private packages (no external import)
│   ├── domain/              # Domain layer (business models)
│   │   └── task.go          # Task entity, Repository interface
│   ├── application/         # Application layer (business logic)
│   │   └── task_service.go  # Task business service
│   ├── infrastructure/      # Infrastructure layer (external dependencies)
│   │   ├── database.go      # Database connection setup
│   │   └── task_repository.go # Repository implementation
│   └── interfaces/          # Interface layer (HTTP API)
│       ├── task_handler.go  # HTTP handlers
│       └── router.go        # API router configuration
├── pkg/                     # Public packages (external import allowed)
│   └── config/             # Configuration management
│       └── config.go       # Environment config loader
├── go.mod                  # Go module definition
├── go.sum                  # Dependency checksums
└── tasks.db               # SQLite database file
```

## 🏗️ Clean Architecture Layers

### 1. Domain Layer (`internal/domain/`)
- **Responsibility**: Pure business models and rules
- **Characteristics**: No external dependencies, framework-independent
- **Files**:
  - `task.go`: Task entity, business rules, Repository interface

### 2. Application Layer (`internal/application/`)
- **Responsibility**: Business logic orchestration, use case implementation
- **Characteristics**: Depends on Domain, abstracts Infrastructure via interfaces
- **Files**:
  - `task_service.go`: Task business logic, input validation

### 3. Infrastructure Layer (`internal/infrastructure/`)
- **Responsibility**: External system integration (DB, external APIs)
- **Characteristics**: Implements Domain interfaces, framework-dependent
- **Files**:
  - `database.go`: GORM database connection management
  - `task_repository.go`: TaskRepository interface implementation

### 4. Interface Layer (`internal/interfaces/`)
- **Responsibility**: External communication (HTTP, CLI, etc.)
- **Characteristics**: Framework-dependent, uses Application layer
- **Files**:
  - `task_handler.go`: HTTP request/response handling
  - `router.go`: API endpoint routing, middleware configuration

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
