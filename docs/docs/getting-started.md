---
sidebar_position: 1
---

# Getting Started with AI CLI

AI CLI is a powerful command-line interface that brings AI capabilities to your development workflow. It helps you search for solutions, debug code, generate documentation, and more.

## Installation

Install the package globally using npm:

```bash
npm install -g @justinhandley/ai-cli
```

Or using pnpm:

```bash
pnpm install -g @justinhandley/ai-cli
```

## Quick Start

1. First, configure your API keys:

```bash
# Configure Anthropic (Claude) API key
ai config anthropic your-api-key

# Configure GitHub token (for search functionality)
ai config github your-github-token
```

2. Try out some basic commands:

```bash
# Search for code solutions
ai search "how to handle TypeScript errors"

# Generate documentation for a file
ai describe src/myfile.ts

# Debug your code
ai debug

# Collect TypeScript files
ai collect ./src
```

## Development Setup

If you want to work on the CLI locally:

```bash
# Clone the repository
git clone https://github.com/justinhandley/ai-cli.git
cd ai-cli

# Install dependencies
pnpm install

# Build the project
pnpm build

# Use local version
pnpm use-local

# Switch back to published version
pnpm use-live
```

## Next Steps

- Learn about all available [commands](/docs/commands)
- Configure your [AI models](/docs/configuration#ai-models)
- Set up your [API keys](/docs/configuration#api-keys)
- Explore [examples](/docs/examples) 