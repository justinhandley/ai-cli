---
slug: configurable-file-collection
title: Configurable File Collection in AI CLI v1.5.0 - A New Way to Customize Your Experience
authors: [justinhandley]
tags: [feature, cli, developer-tools, productivity, minor]
---

We're excited to announce AI CLI v1.5.0 with a powerful new feature: configurable file collection! This enhancement allows you to customize how files are collected for AI processing, making the tool more versatile for different programming languages and project types.

## What's New?

The new collection configuration system lets you:

- Create custom configurations for different languages and project types
- Specify which file extensions to collect
- Define patterns for files to ignore
- Set a default configuration
- Switch between configurations via command line

## Default Configuration

We've included a default "TypeScript" configuration that matches the original behavior:
- Extensions: `.ts`, `.tsx`
- Ignore patterns: `**/node_modules/**`, `**/dist/**`, `**/*.test.ts`, `**/*.config.ts`, `**/*.spec.ts`

## How to Use

### Managing Configurations

Use the new `config-collect` command to manage your collection configurations:

```bash
# List all configurations
ai config-collect list

# Create a new configuration
ai config-collect create

# Edit an existing configuration
ai config-collect edit <name>

# Delete a configuration
ai config-collect delete <name>

# Set a configuration as default
ai config-collect set-default <name>
```

### Using Configurations

When collecting files, you can specify which configuration to use:

```bash
# Use default configuration
ai collect ./src

# Use a specific configuration
ai collect ./src -c python
```

## Example: Python Configuration

Here's how you might set up a Python configuration:

```bash
# Create a new configuration
ai config-collect create

# Follow the prompts to set:
# - Name: Python
# - Extensions: .py, .pyx
# - Ignore patterns: **/venv/**, **/__pycache__/**, **/*.test.py
```

## Configuration Structure

Each configuration includes:
- `name`: A descriptive name for the configuration
- `extensions`: Array of file extensions to collect
- `ignorePatterns`: Array of glob patterns to ignore
- `isDefault`: Boolean indicating if this is the default configuration

Example configuration:
```json
{
  "collectionConfigs": {
    "typescript": {
      "name": "TypeScript",
      "extensions": [".ts", ".tsx"],
      "ignorePatterns": ["**/node_modules/**", "**/dist/**", "**/*.test.ts"],
      "isDefault": true
    },
    "python": {
      "name": "Python",
      "extensions": [".py", ".pyx"],
      "ignorePatterns": ["**/venv/**", "**/__pycache__/**", "**/*.test.py"],
      "isDefault": false
    }
  }
}
```

## Benefits

This new feature brings several benefits:

1. **Language Support**: Easily add support for any programming language
2. **Project Customization**: Create configurations specific to your project's needs
3. **Flexibility**: Switch between configurations as needed
4. **Consistency**: Maintain consistent file collection rules across your team

## Getting Started

To get started with the new collection configuration feature:

1. Check your current configurations: `ai config-collect list`
2. Create a new configuration: `ai config-collect create`
3. Try it out: `ai collect ./src -c <your-config-name>`

## Documentation

For more detailed information about collection configurations, check out our updated documentation:
- [Commands Documentation](/docs/commands#collect)
- [Configuration Documentation](/docs/configuration#collection-configurations)

We're excited to see how you use this new feature to customize your AI CLI experience! Let us know what configurations you create and how they help your workflow. 