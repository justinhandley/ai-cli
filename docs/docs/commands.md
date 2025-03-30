---
sidebar_position: 3
---

# Commands

AI CLI provides several powerful commands to help with your development workflow.

## Git Worktree Management

### Create Worktrees

Create multiple Git worktrees for parallel development with AI assistance:

```bash
ai worktree [options] <branches...>
```

This command will:
- Create multiple isolated development environments
- Set up each worktree with its own branch
- Install dependencies if requested
- Launch Cursor IDE instances for each worktree

#### Options
- `-p, --pnpm` - Install dependencies using pnpm in each worktree

#### Examples
```bash
# Create worktrees for multiple features
ai worktree -p feature-a feature-b feature-c

# Create worktrees without installing dependencies
ai worktree bugfix-1 bugfix-2
```

### Merge Worktrees

Merge changes from a worktree branch into main and clean up all worktrees:

```bash
ai worktree-merge <branch>
```

This command will:
- Verify you're on the main branch
- Check for uncommitted changes in the target worktree
- Merge the specified branch into main
- Clean up all worktrees and delete temporary branches

#### Examples
```bash
# Merge feature-a into main and clean up
ai worktree-merge feature-a
```

## Search

Search GitHub issues and Stack Overflow for coding problems, then get AI-powered analysis:

```bash
ai search "your error message or question"
```

### Options
- `-g, --github-limit <number>` - Number of GitHub issues to search (default: 3)
- `-s, --stackoverflow-limit <number>` - Number of Stack Overflow posts to search (default: 3)

### Examples
```bash
# Search with default limits (3 from each service)
ai search "TypeError: Cannot read property 'map' of undefined"

# Search with custom limits
ai search "TypeScript error" -g 5 -s 5

# Get more GitHub issues but fewer Stack Overflow posts
ai search "React issue" -g 10 -s 3
```

## Debug

Get AI-powered debugging assistance for your code:

```bash
ai debug
```

This command will:
1. Prompt you to paste your error messages (press Enter after each line, then CTRL+D when finished)
2. Optionally accept a code snippet for context
3. Use the configured AI model to analyze the errors and provide:
   - Reasoning-based analysis of what's going wrong
   - Step-by-step debugging strategies
   - Suggested code changes if applicable

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

## Describe

Generate English documentation from code files:

```bash
ai describe <file> [options]
```

This command will:
- Read the specified code file
- Generate a detailed English description of the code's functionality
- Save the description as a markdown file next to the source file
- Display the documentation in the console

### Options
- `-o, --output <path>` - Specify custom output file path (default: `<input>.md`)

### Examples
```bash
# Generate documentation next to the source file
ai describe src/myfile.ts

# Generate documentation with custom output path
ai describe src/myfile.ts -o docs/description.md
```

## Configuration Commands

### API Keys
```bash
# Set API key for a service
ai config <service> <apiKey>

# List configured services
ai config-list

# Get help with configuring a service
ai config-help [service]
```

### AI Models
```bash
# Configure which AI model to use for each command
ai config-model <command> <service> <model>

# List current model configuration
ai config-model list
```

## Help
```bash
# Show help information for all commands
ai help

# Show help for a specific command
ai <command> --help
``` 