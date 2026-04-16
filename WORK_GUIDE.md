# Work Guide

## Project Overview
- **Platform**: iOS mobile app (iOS 14.0+)
- **Goal**: Task management application
- **Frontend**: React + TypeScript (wrapped for iOS with Capacitor)
- **Backend**: Go + Gin + GORM
- **Testing**: Playwright (E2E), Vitest (Unit)
- **CI/CD**: GitHub Actions
- **Native features**: Push Notifications, Camera, Geolocation, Keyboard
- **Detailed docs**:
  - Root: `README.md`
  - Frontend: `frontend/README.md`
  - Backend: `backend/README.md`

## 1. Worklog Usage
- **Before starting work**: Check `worklogs/` for related prior work.
- **Understand context**: Review previous approaches, issues, and fixes.
- **Keep consistency**: Follow established patterns and prior decisions.
- **Use past lessons**: Reuse successful approaches and avoid repeated failures.
- **After finishing**: Add a new worklog or update an existing one.

## 2. Plan Writing Guide

### 2.1 Decide Plan Depth
Choose the plan depth based on impact.

**Use a deeper plan when:**
- Changes span multiple files or modules.
- You are migrating patterns or doing a refactor.
- Multiple implementation options must be compared.
- Platform/environment-specific approaches are required.
- Architecture or stack-level decisions are involved.

**A simpler plan is enough when:**
- A single file or function is changing.
- The requirement is clear and bounded.
- The task is documentation-only.
- The bug and fix are straightforward.

### 2.2 Deep Plan Structure
For complex changes, use this structure:

#### 1) Current State
- Inspect all relevant implementations/files.
- Mark status for each area:
  - [done] Already meets requirements
  - [required] Needs changes
  - [caution] Partially problematic
- Include code location examples (`file_path:line_number`).

#### 2) Problem
- Why change is needed
- Limits of the current approach
- Technical constraints
- Impact if left unresolved

#### 3) Solution Plan
- List all reasonable options
- Compare pros and cons
- Explain selected option and why
- Define step-by-step execution
- Note expected risks and mitigations

#### 4) Files to Modify
- List target files
- Describe exact changes per file
- Note cross-file dependencies and ordering
- Include tests and documentation updates

## 3. Development and Testing

### 3.1 Run Development Servers
```bash
# Run from project root (frontend + backend together)
make dev

# Browser: http://localhost:5173
# Backend: http://localhost:8080
```

**Important**: Frontend and backend are interdependent, so run both with `make dev`.

### 3.2 Test Guidelines

**When backend API issues occur**
- Verify backend behavior directly with curl:
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/tasks
```

**E2E tests**
```bash
# Terminal 1
make dev

# Terminal 2
make test-e2e                    # Development mode
make test-e2e PHASE=release      # Production build mode
```

## 4. Accuracy and Source Policy

### 4.1 Source Priority
1. Official documentation (latest version)
2. Official framework/library blogs or release notes
3. Internal project docs (including worklogs)
4. Community posts and third-party blogs

### 4.2 Version Handling
- Always verify the version of referenced documentation.
- Confirm that document versions match project versions.
- If versions differ, explicitly communicate the gap.

## 5. CLI Workflow Commands

### Git Worktree Management
Use `/worktree <branch-name>` to create isolated workspaces:
- Creates a worktree at `../task-manager-<branch-name>`
- Automatically links command configuration
- Enables parallel work across features
- Detailed guide: `.claude/commands/worktree.md`

### Git and PR Management
Use `/pr-open` for Git operations and PR creation:
- Runs Git status checks and commit flow
- Generates a PR description with approval flow
- Detailed guide: `.claude/commands/pr-open.md`

Use `/pr-merge` to merge PRs and clean up:
- Squash-merges PR and deletes remote branch
- Switches to `main` and syncs
- Removes worktree and local feature branch
- Detailed guide: `.claude/commands/pr-merge.md`

### Documentation Sync
Use `/guide-sync` to update docs automatically:
- Analyzes Git changes and updates `README.md` or `WORK_GUIDE.md`
- `README.md`: project overview changes (stack, architecture, commands)
- `WORK_GUIDE.md`: implementation guidance (patterns, conventions)
- Routes updates to root/frontend/backend docs as needed
- Detailed guide: `.claude/commands/guide-sync.md`