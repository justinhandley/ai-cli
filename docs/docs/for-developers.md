---
sidebar_position: 5
---

# For Developers

This section contains information for developers who want to contribute to AI CLI or work with it locally.

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

## Contributing

We welcome contributions to AI CLI! Whether you're interested in:
- Adding new AI service integrations
- Improving existing features
- Enhancing documentation
- Fixing bugs
- Adding new commands

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

We're particularly interested in contributions that:
- Add support for new AI services
- Improve error handling and user experience
- Add new features that enhance developer productivity
- Improve documentation and examples

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits focused and descriptive

## Project Structure

The project is organized as follows:

```
ai-cli/
├── src/                    # Source code
│   ├── commands/          # CLI commands
│   ├── services/          # AI and external services
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── docs/                  # Documentation
└── examples/              # Example usage
```

## Building and Testing

```bash
# Build the project
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Local Development

When developing locally, you can use `pnpm use-local` to use your local version of the CLI. This is useful for testing changes before publishing.

To switch back to the published version:
```bash
pnpm use-live
``` 