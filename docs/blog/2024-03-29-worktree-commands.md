---
slug: worktree-commands
title: New Worktree Commands for Parallel AI Development
authors: [justinhandley]
tags: [release, minor, cli, git]
---

We're excited to announce the release of AI CLI v1.3.0, which introduces powerful new worktree commands inspired by [John Lindquist's egghead.io article on parallel AI development](https://egghead.io/launch-multiple-cursor-composer-ai-agents-to-work-in-parallel~y1q56). These commands enable you to run multiple Cursor Composer AI agents in parallel, significantly speeding up your development workflow.

## New Features

### Worktree Management

The new `worktree` command creates isolated Git worktrees for parallel development:

```bash
ai worktree <branch1> <branch2> ...
```

Key features:
- Creates multiple worktrees in parallel
- Optional dependency installation with `-p/--pnpm` flag
- Automatic Cursor instance launching
- Clean directory structure
- Safe branch creation

### Worktree Merging

The new `worktree-merge` command simplifies merging changes from worktrees:

```bash
ai worktree-merge <branch>
```

Key features:
- Merges changes from a worktree into main
- Handles uncommitted changes
- Cleans up worktrees and branches
- Provides clear feedback
- Safe merge process

### Example Usage

1. Create multiple worktrees:
```bash
ai worktree feature-a feature-b feature-c
```

2. Create worktrees and install dependencies:
```bash
ai worktree -p feature-a feature-b
```

3. Merge changes from a worktree:
```bash
ai worktree-merge feature-a
```

## When to Use

These commands are perfect for:
- Running multiple AI agents in parallel
- Experimenting with different approaches
- Testing multiple solutions simultaneously
- Managing complex feature branches
- Rapid prototyping and iteration

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