# Task Manager

Full-stack task management application with React frontend, Go backend, and iOS support.

## 🎯 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
  - Mobile: Capacitor 7.4.2 (iOS 14.0+)
- **Backend**: Go 1.23+ + Gin + GORM
  - Database: SQLite (dev), PostgreSQL (prod-ready)
- **Testing**: Playwright (E2E), Vitest (unit)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
task-manager/
├── frontend/        # React + TypeScript frontend (→ frontend/README.md)
│   ├── e2e/        # Playwright E2E tests
│   └── ios/        # iOS project (Capacitor)
├── backend/         # Go backend services (→ backend/README.md)
├── .github/         # GitHub configuration
│   └── workflows/  # CI/CD workflows (GitHub Actions)
├── scripts/         # Build and utility scripts
├── .claude/         # Claude Code configuration
└── Makefile         # Development commands
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18+
- **Go**: 1.23+
- **Yarn**: Latest stable
- **Xcode**: 15.0+ (for iOS development)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd task-manager

# Install frontend dependencies
cd frontend && yarn install

# Install backend dependencies
cd ../backend && go mod download
```

### Development

```bash
make dev          # Start backend + web (http://localhost:5173, :8080)
make watch-ios    # Start iOS simulator
```

## 🧪 Testing

```bash
# E2E tests
make dev          # Terminal 1
make test-e2e     # Terminal 2

# Production mode
make build && make preview         # Terminal 1
make test-e2e PHASE=release        # Terminal 2
```

## 🏗️ Build & Deploy

```bash
make build        # Build application
make preview      # Run production build (http://localhost:4173, :8080)
```

## 🛠️ Development Commands

### Git and PR Management
Use `/pr-open` command for Git operations and PR creation:
- Automatic Git status check and commit creation
- Auto-generated PR description with user approval process
- Detailed guidelines: `.claude/commands/pr-open.md`

### Documentation Sync
Use `/guide-sync` command to auto-update documentation:
- Analyzes Git changes and updates README or CLAUDE.md accordingly
- **README updates**: Project overview changes (tech stack, architecture, commands)
- **CLAUDE.md updates**: Implementation details (coding patterns, guidelines)
- Routes updates to Frontend/Backend/Root documentation
- Detailed guidelines: `.claude/commands/guide-sync.md`

## 📚 Documentation

- **Frontend**: See [frontend/README.md](frontend/README.md)
- **Backend**: See [backend/README.md](backend/README.md)
- **E2E Testing**: See [frontend/e2e/CLAUDE.md](frontend/e2e/CLAUDE.md)
- **Claude Code Guide**: See [CLAUDE.md](CLAUDE.md)
