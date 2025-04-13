---
sidebar_position: 2
---

# Commands

## Configuration

### API Keys

Configure API keys for various services:

```bash
# Set API key for a service
ai config <service> <apiKey>

# List configured services
ai config-list

# Get help with configuration
ai config-help [service]
```

### AI Models

Configure which AI model to use for each command:

```bash
# Set model for a command
ai config-model <command> <service> <model>

# List current configuration
ai config-model list
```

### Git Settings

Configure Git-related settings:

```bash
# Set default branch
ai config-git default-branch <branch>

# View current configuration
ai config-git show
```

## Search

Search for code solutions with AI analysis:

```bash
ai search <query> [options]
```

Options:
- `-g, --github-limit <n>` - Number of GitHub issues to search (default: 3)
- `-s, --stackoverflow-limit <n>` - Number of Stack Overflow posts to search (default: 3)

## Debug

Get AI assistance for debugging:

```bash
ai debug <error-message>
```

Features:
- Error analysis
- Debugging strategies
- Solution suggestions

## Describe

Generate documentation from code:

```bash
ai describe <file> [options]
```

Options:
- `-o, --output <path>` - Custom output file path (default: `<input>.md`)

## Collect

Collect and concatenate TypeScript files for AI processing:

```bash
ai collect [path]
```

This command will:
- Search for `.ts` and `.tsx` files recursively in the specified directory
- Concatenate them into a single file in the `.ai-cli` folder
- Exclude test files and files in node_modules/dist directories
- Optionally analyze the collected code using the configured AI model

If no path is specified, the current directory will be used.

## Git Worktree Management

### Create Worktrees

Create and manage Git worktrees for parallel development:

```bash
ai worktree [options] <branches...>
```

Options:
- `-p, --pnpm` - Install dependencies using pnpm in each worktree

Example:
```bash
# Create worktrees for multiple features
ai worktree feature-a feature-b feature-c

# Create worktrees and install dependencies
ai worktree -p feature-a feature-b
```

### List Worktrees

View all worktrees created by AI CLI:

```bash
ai worktree-list
```

This shows:
- Branch names
- Worktree paths
- Creation timestamps
- Current status (Active/Removed)

### Merge Worktrees

Merge changes from a worktree branch:

```bash
ai worktree-merge <branch> [target-branch]
```

If no target branch is specified, uses the configured default branch.

Example:
```bash
# Merge into default branch
ai worktree-merge feature-a

# Merge into specific branch
ai worktree-merge feature-a release/1.0
```

### Merge All Worktrees

Merge all tracked worktrees in one command:

```bash
ai worktree-merge-all [target-branch]
```

Features:
- Merges all worktrees into target branch
- Uses configured default branch if none specified
- Handles each worktree independently
- Continues if one merge fails
- Cleans up successfully merged worktrees

### Remove Worktree

Remove a worktree without merging changes:

```bash
ai worktree-remove <branch>
```

Features:
- Safely removes worktree directory
- Warns about uncommitted changes
- Deletes associated branch
- Interactive confirmation

## Help

Show help information for all commands:

```bash
ai help
```

Or get help for a specific command:

```bash
ai <command> --help
``` 