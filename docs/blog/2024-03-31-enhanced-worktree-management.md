---
slug: enhanced-worktree-management
title: Enhanced Git Worktree Management in AI CLI v1.4.0
authors: [justinhandley]
tags: [release, minor, cli, git]
---

We're excited to announce the release of AI CLI v1.4.0, which brings significant enhancements to Git worktree management capabilities. This release introduces new commands and configuration options that make working with multiple feature branches even more efficient.

<!-- truncate -->

## New Features

### Worktree State Tracking

AI CLI now maintains a state file that tracks all worktrees created through the tool:
- Stores branch names, paths, and creation timestamps
- Automatically updates when worktrees are created or removed
- Helps maintain consistency between commands

### New Commands

#### `worktree-list`
View all worktrees created by AI CLI:
```bash
ai worktree-list
```
Features:
- Shows branch names and paths
- Displays creation timestamps
- Indicates worktree status (Active/Removed)
- Helps track parallel development progress

#### `worktree-merge-all`
Merge all tracked worktrees in one command:
```bash
ai worktree-merge-all [target-branch]
```
Features:
- Merges all worktrees into the target branch
- Uses configured default branch if none specified
- Handles each worktree independently
- Continues processing if one merge fails
- Cleans up successfully merged worktrees

### Configurable Default Branch

You can now configure your default target branch:
```bash
ai config-git default-branch develop
```
Features:
- Set your preferred default branch (e.g., develop, main)
- View current git configuration
- Used by merge commands when no target specified

## Improved Workflow

The enhanced worktree management system enables several improved workflows:

1. **Parallel Feature Development**
```bash
# Create multiple worktrees
ai worktree -p feature-a feature-b feature-c

# List and monitor progress
ai worktree-list

# Merge all completed features
ai worktree-merge-all
```

2. **Selective Merging**
```bash
# Merge specific features
ai worktree-merge feature-a release/1.0
ai worktree-merge feature-b develop

# Clean up remaining worktrees
ai worktree-merge-all
```

3. **Branch Management**
```bash
# Set default branch
ai config-git default-branch develop

# View configuration
ai config-git show

# Use default branch in commands
ai worktree-merge feature-a  # merges to develop
```

## Installation

Update to the latest version:

```bash
npm install -g @justinhandley/ai-cli@latest
```

Or using pnpm:

```bash
pnpm install -g @justinhandley/ai-cli@latest
```

## What's Next?

We're continuing to improve the worktree management system based on user feedback. Some areas we're exploring:
- Additional worktree statistics and metrics
- Enhanced error recovery during merge-all
- More configuration options for worktree management
- Better integration with CI/CD workflows

## Feedback

We'd love to hear your thoughts on these enhancements. Feel free to:
- Try out the new features and share your experience
- Suggest additional improvements
- Report any issues you encounter
- Share your worktree management workflows

You can reach us through:
- [GitHub Issues](https://github.com/justinhandley/ai-cli/issues)
- [GitHub Discussions](https://github.com/justinhandley/ai-cli/discussions) 