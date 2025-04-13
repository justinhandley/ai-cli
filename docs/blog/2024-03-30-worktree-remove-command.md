---
slug: worktree-remove-command
title: New worktree-remove Command for Safe Worktree Cleanup
authors: [justinhandley]
tags: [release, patch, cli, git]
---

We're excited to announce the release of AI CLI v1.3.1, which introduces a new `worktree-remove` command for safely removing Git worktrees without merging changes.

<!-- truncate -->

## New Feature

### Safe Worktree Removal

The new `worktree-remove` command provides a safe way to remove worktrees when you don't want to merge their changes:

```bash
ai worktree-remove <branch>
```

Key features:
- Safely removes worktrees without merging changes
- Warns about uncommitted changes
- Interactive confirmation to prevent accidental data loss
- Automatically cleans up associated branches
- Clear feedback about the removal process

### Example Usage

1. Remove a worktree:
```bash
ai worktree-remove feature-a
```

2. If there are uncommitted changes:
```
Warning: Found uncommitted changes in worktree. These changes will be lost.
Use "ai worktree-merge" to merge changes before removing.
Press Ctrl+C to abort or Enter to continue...
```

3. The command will:
- Remove the worktree directory
- Delete the associated branch (if not main)
- Provide confirmation of successful removal

## When to Use

Use `worktree-remove` when you want to:
- Discard changes in a worktree
- Clean up abandoned experiments
- Remove worktrees that are no longer needed
- Start fresh with a feature branch

Use `worktree-merge` when you want to:
- Keep and merge changes from a worktree
- Integrate completed features
- Preserve work done in a worktree

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

We'd love to hear your thoughts on the new worktree-remove command. Feel free to:
- Try it out and let us know if you encounter any issues
- Suggest improvements or additional features
- Share your use cases and success stories

You can reach us through:
- [GitHub Issues](https://github.com/justinhandley/ai-cli/issues)
- [GitHub Discussions](https://github.com/justinhandley/ai-cli/discussions) 