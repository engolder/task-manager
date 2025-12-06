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

# Create .claude symlink
echo "Linking Claude configuration..."
ln -s "$CURRENT_DIR/.claude" "$WORKTREE_PATH/.claude"

echo ""
echo "✅ Worktree created successfully!"
echo "   Path: $WORKTREE_PATH"
echo "   Branch: $BRANCH"
echo "   Claude config: linked"
echo ""
echo "Tip: Run 'make init' to install dependencies"
echo ""

# Change to worktree directory
cd "$WORKTREE_PATH" || exit 1
