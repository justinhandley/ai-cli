---
slug: worktree-commands
title: New Worktree Commands for Parallel Development
authors: [justinhandley]
tags: [release, feature, cli, git]
---

We're excited to announce the release of AI CLI v1.3.0, which introduces powerful new Git worktree management commands. These commands help you work on multiple features in parallel with AI assistance.

## New Features

### Git Worktree Management

The new worktree commands enable you to create and manage multiple isolated development environments:

```bash
# Create multiple worktrees for parallel development
ai worktree -p feature-a feature-b feature-c

# Merge changes and clean up worktrees
ai worktree-merge feature-a
```

Key features:
- Create multiple isolated development environments
- Run multiple AI agents in parallel
- Easily merge changes and clean up worktrees
- Automatic dependency management and Cursor IDE integration

### Example Usage

1. Create worktrees for multiple features:
```bash
ai worktree -p feature-a feature-b feature-c
```
This will:
- Create separate worktrees for each feature
- Install dependencies using pnpm (with the `-p` flag)
- Launch Cursor IDE instances for each worktree

2. Work on features in parallel:
- Each worktree has its own isolated environment
- You can run different AI agents in each worktree
- No conflicts between different features

3. Merge changes and clean up:
```bash
ai worktree-merge feature-a
```
This will:
- Merge the specified branch into main
- Clean up all worktrees
- Delete temporary branches

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

We're working on more features to enhance your development workflow. Stay tuned for updates!

## Feedback

We'd love to hear your thoughts on the new worktree commands. Feel free to:
- Try them out and let us know if you encounter any issues
- Suggest improvements or additional features
- Share your use cases and success stories

You can reach us through:
- [GitHub Issues](https://github.com/justinhandley/ai-cli/issues)
- [GitHub Discussions](https://github.com/justinhandley/ai-cli/discussions) 