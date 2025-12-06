#!/bin/bash
# Usage: ./scripts/create-worktree.sh <branch-name>
# Creates a worktree at ../task-manager-<branch-name>

if [ -z "$1" ]; then
  echo "Error: Branch name is required"
  echo "Usage: ./scripts/create-worktree.sh <branch-name>"
  exit 1
fi

BRANCH=$1
WORKTREE_NAME="task-manager-$BRANCH"
WORKTREE_PATH="../$WORKTREE_NAME"
CURRENT_DIR=$(pwd)

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
  echo "Error: Directory $WORKTREE_PATH already exists"
  exit 1
fi

# Check if branch exists
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch '$BRANCH' already exists, checking out..."
  git worktree add "$WORKTREE_PATH" "$BRANCH"
else
  echo "Creating new branch '$BRANCH'..."
  git worktree add -b "$BRANCH" "$WORKTREE_PATH"
fi

# Link settings.local.json only (commands are managed by git)
echo "Linking Claude settings..."
ln -sf "$CURRENT_DIR/.claude/settings.local.json" "$WORKTREE_PATH/.claude/settings.local.json"

echo ""
echo "✅ Worktree created successfully!"
echo "   Path: $WORKTREE_PATH"
echo "   Branch: $BRANCH"
echo "   Claude settings: linked"
echo ""
