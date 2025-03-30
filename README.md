# AI CLI

A command-line interface for interacting with various AI services and development tools.

📚 [Full Documentation](https://justinhandley.github.io/ai-cli/)

## Installation

Install the package globally using npm:

    npm install -g @justinhandley/ai-cli

Or using pnpm:

    pnpm install -g @justinhandley/ai-cli

## Development

To work on the CLI locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-cli.git
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

## Key Features

The CLI can be accessed using the `ai` command and provides the following features:

### AI-Powered Development
- 🔍 Search GitHub and Stack Overflow with AI analysis
- 🐛 Debug code with AI assistance
- 📝 Generate code documentation
- 🔄 Collect and analyze TypeScript files

### Git Worktree Management
- Create multiple isolated development environments
- Run multiple AI agents in parallel
- Easily merge changes and clean up worktrees
- Automatic dependency management and Cursor IDE integration

### Configuration
- Secure API key management for multiple AI services
- Flexible AI model configuration per command
- Easy service setup with built-in help

## Quick Start

1. Configure your API keys:
```bash
ai config anthropic <your-key>
ai config github <your-key>
```

2. Try the search command:
```bash
ai search "your error message"
```

3. Create parallel worktrees:
```bash
ai worktree -p feature-a feature-b
```

For detailed usage instructions and examples, visit the [full documentation](https://justinhandley.github.io/ai-cli/).

## Credits

This project was inspired by [Programming in English with Cursor](https://egghead.io/programming-in-english-with-cursor~yeztf) by [John Lindquist](https://github.com/johnlindquist) on egghead.io. The idea of using AI to generate human-readable documentation and specifications from code has been adapted and expanded in this project to create a more comprehensive set of development tools.