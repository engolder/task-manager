# Frontend

React 19 + TypeScript frontend application with iOS support via Capacitor.

## 🎯 Tech Stack

- **Framework**: React 19 (functional components + Hooks)
- **Language**: TypeScript 5.8+ (strict mode)
- **State Management**:
  - Server state: React Query (TanStack Query)
  - Client state: Zustand (UI state)
- **Routing**: React Router v7
- **Styling**: Vanilla Extract (type-safe CSS-in-JS) + Radix UI
- **HTTP Client**: ky (modern fetch wrapper)
- **Build Tool**: Vite 7
- **Mobile**: Capacitor 7.4.2 (iOS 14.0+)

## 📁 Folder Structure

```
src/
├── app/             # App initialization, providers, routing
│   ├── styles/      # Global styles
│   ├── providers/   # App providers (QueryProvider, etc.)
│   └── index.ts     # App entry point
├── pages/           # Page components
│   ├── home/        # Home page
│   │   ├── ui/      # Page UI components
│   │   └── index.ts # Page entry point
│   └── index.ts     # Page exports
├── widgets/         # Large independent UI blocks
│   ├── task/        # Task widget
│   │   ├── ui/      # Widget UI components
│   │   ├── lib/     # Widget logic
│   │   └── index.ts # Widget entry point
│   └── index.ts     # Widget exports
├── features/        # Feature modules
│   ├── task-list/   # Task list feature
│   │   ├── hooks/   # React Query hooks (server state)
│   │   ├── ui/      # Feature UI components
│   │   ├── model/   # Feature state (client state)
│   │   ├── lib/     # Feature logic
│   │   └── index.ts # Feature entry point
│   └── index.ts     # Feature exports
├── entities/        # Business entities
│   ├── task/        # Task entity
│   │   ├── ui/      # Entity UI components
│   │   ├── model/   # Entity models
│   │   ├── lib/     # Entity logic
│   │   └── index.ts # Entity entry point
│   └── index.ts     # Entity exports
└── shared/          # Shared resources
    ├── ui/          # UI kit
    ├── api/         # API client (HTTP functions)
    ├── lib/         # Utilities
    ├── config/      # Configuration
    └── index.ts     # Shared exports

ios/                 # iOS project directory
├── App/            # Xcode project
│   ├── App/       # App source
│   ├── Podfile    # CocoaPods dependencies
│   └── App.xcworkspace  # Xcode workspace
└── .gitignore     # iOS-specific gitignore
```

## 🏗️ Layer Responsibilities

### 1. app/ - Application Initialization
- Global providers (QueryProvider, Context API)
- Routing configuration
- Global styles
- App configuration

### 2. pages/ - Page Components
- Route-mapped pages
- Composition of widgets and features
- Page-specific layouts

### 3. widgets/ - Independent Large Blocks
- Reusable large UI blocks
- Components shared across multiple pages
- Self-contained functional UI modules

### 4. features/ - Feature Modules
- Business logic
- Server state management (React Query hooks in `hooks/`)
- Client state management (Zustand, Context in `model/`)
- All components and logic related to specific features

### 5. entities/ - Business Entities
- Domain models
- Entity-related logic
- Business rules

### 6. shared/ - Shared Resources
- UI kit
- API client (HTTP functions using ky)
- Utility functions
- Configuration files

## 🚀 Development

### Prerequisites
- Node.js 18+
- Yarn

### Installation

```bash
# Install dependencies
yarn install
```

### Available Commands

```bash
# Development server (http://localhost:5173)
yarn dev

# Type checking
yarn build  # includes tsc -b

# Code formatting
yarn format

# Linting
yarn lint

# Lint check and auto-fix
yarn check

# Production build
yarn build

# Preview production build (http://localhost:4173)
yarn preview

# E2E tests
yarn test:e2e      # Run Playwright E2E tests
yarn test:e2e:ui   # Run with Playwright UI for debugging
```

### iOS Development

```bash
# Build and sync with iOS
yarn build
npx cap sync ios

# Open in Xcode
npx cap open ios

# Or use dev script with live reload
yarn ios:dev
```

### iOS Build Commands

```bash
# Manual build process
yarn ios:build     # Build and sync iOS project
yarn ios:open      # Open Xcode project

# Automatic live reload setup
yarn ios:dev       # Detect IP, configure, build, and open Xcode
```

## 📱 iOS Development

### Capacitor Configuration
- **Version**: Capacitor 7.4.2
- **iOS Support**: iOS 14.0+
- **Native Features**: Camera, Geolocation, Keyboard, Push Notifications

### Build Process
1. **Build web app**: `yarn build`
2. **Sync with Capacitor**: `npx cap sync ios`
3. **Open Xcode**: `npx cap open ios`
4. **Select device/simulator**: Choose target in Xcode
5. **Run**: Click Run button (⌘R)

### Live Reload Setup
```bash
# Automatic configuration
yarn ios:dev
```

This script:
- Detects local IP address
- Configures Capacitor for live reload
- Builds and syncs iOS project
- Opens Xcode

## 🧪 Testing

### Test Tools
- **Playwright**: E2E testing (full app integration)
- **Vitest**: Unit test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  it('should toggle task when checkbox is clicked', () => {
    const mockToggle = jest.fn();
    const task = { id: '1', text: 'Test task', completed: false };

    render(<TaskItem task={task} onToggle={mockToggle} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should create and complete a task', async ({ page }) => {
  await page.goto('/');

  // Add task
  await page.getByPlaceholder('Enter task').fill('New task');
  await page.getByRole('button', { name: 'Add' }).click();

  // Toggle task completion
  const checkbox = page.getByText('New task')
    .locator('..')
    .locator('button[role="checkbox"]');
  await checkbox.click();
  await expect(checkbox).toHaveAttribute('data-state', 'checked');
});
```

### Running E2E Tests

```bash
# From project root
make dev          # Terminal 1: Start services
make test-e2e     # Terminal 2: Run E2E tests (debug mode, port 5173)

# Or release mode
make build && make preview           # Terminal 1
make test-e2e PHASE=release          # Terminal 2 (port 4173)
```

**Key Features:**
- Automatic service readiness check (10s timeout)
- `PHASE` variable for debug (5173) / release (4173) ports
- Playwright config: `playwright.config.ts`
- Test files: `e2e/**/*.spec.ts`

## 📚 References

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query (TanStack Query)](https://tanstack.com/query/latest) - Server state management
- [ky HTTP Client](https://github.com/sindresorhus/ky) - Modern fetch wrapper
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vanilla Extract](https://vanilla-extract.style/)
- [Zustand](https://zustand-demo.pmnd.rs/) - Client state management
- [Radix UI](https://www.radix-ui.com/docs) - Accessible components
- [Playwright](https://playwright.dev/) - E2E testing

## 📖 Additional Documentation

- **Architecture Guide**: [CLAUDE.md](CLAUDE.md)
- **E2E Testing**: [e2e/CLAUDE.md](e2e/CLAUDE.md)
