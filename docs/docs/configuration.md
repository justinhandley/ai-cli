---
sidebar_position: 3
---

# Configuration

AI CLI can be configured with various API keys, AI models, and Git settings to suit your needs.

## API Keys

The CLI supports multiple AI and development services. You'll need to configure API keys for the services you want to use.

### Supported Services
- anthropic (Claude)
- github (for search functionality)
- google-studio
- openai

### Setting API Keys

Use the `config` command to set API keys:

```bash
ai config <service> <apiKey>
```

### Examples
```bash
# Configure Anthropic (Claude) API key
ai config anthropic sk-ant-xxxxx

# Configure GitHub token
ai config github ghp_xxxxx
```

### Getting API Keys

Use the `config-help` command to get instructions for obtaining API keys:

```bash
# Get help for all supported services
ai config-help

# Get help for a specific service
ai config-help anthropic
ai config-help github
```

### Listing Configured Services

View which services are configured:

```bash
ai config-list
```

## Git Settings

Configure Git-related settings for worktree management.

### Default Branch

Set your preferred default branch for merge operations:

```bash
# Set default branch
ai config-git default-branch develop

# View current configuration
ai config-git show
```

The default branch setting is used by:
- `worktree-merge` when no target branch is specified
- `worktree-merge-all` when no target branch is specified

This allows you to match your repository's branching strategy (e.g., using 'develop' instead of 'main').

## AI Models

You can configure which AI model to use for each command.

### Available Models
- Anthropic (Claude):
  - claude-3-opus-20240229
  - claude-3-sonnet-20240229
  - claude-3-haiku-20240307
- OpenAI:
  - gpt-4
  - gpt-4-turbo-preview
  - gpt-3.5-turbo

### Recommended Default Models

When you configure your first service, it will automatically become the default for all commands. Here are our recommended default models for each service:

#### Anthropic (Claude)
- Default Model: `claude-3-haiku-20240307`
  - Fast and efficient for most tasks
  - Good balance of speed and quality
  - Recommended for search and documentation generation

#### OpenAI
- Default Model: `gpt-4-turbo-preview`
  - Most capable model for complex tasks
  - Excellent for debugging and code analysis
  - Recommended for debugging and complex code analysis

#### Google Studio
- Default Model: `gemini-pro`
  - Good for code analysis and documentation
  - Efficient for general tasks
  - Recommended for code collection and analysis

### Command-Specific Recommendations

While you can use any service/model combination, here are our recommended pairings for each command based on their specific needs:

#### Search Command
- Recommended: Anthropic (Claude) with `claude-3-haiku-20240307`
  - Fast response times for quick searches
  - Good at analyzing and summarizing search results
  - Efficient for handling multiple search results
  - Alternative: OpenAI with `gpt-4-turbo-preview` for more detailed analysis

#### Debug Command
- Recommended: OpenAI with `gpt-4-turbo-preview`
  - Excellent at understanding complex error patterns
  - Strong reasoning capabilities for debugging
  - Good at suggesting specific code fixes
  - Alternative: Anthropic with `claude-3-sonnet-20240229` for a good balance

#### Describe Command
- Recommended: Anthropic (Claude) with `claude-3-sonnet-20240229`
  - Good at generating clear, concise documentation
  - Strong understanding of code structure
  - Balanced performance for documentation tasks
  - Alternative: OpenAI with `gpt-4-turbo-preview` for more detailed documentation

#### Collect Command
- Recommended: Google Studio with `gemini-pro`
  - Efficient at analyzing large codebases
  - Good at identifying patterns across multiple files
  - Fast processing of collected code
  - Alternative: Anthropic with `claude-3-haiku-20240307` for more focused analysis

### Configuring Models

Use the `config-model` command to set which model to use for each command:

```bash
ai config-model <command> <service> <model>
```

### Examples
```bash
# Configure Claude for search command
ai config-model search anthropic claude-3-haiku-20240307

# Configure GPT-4 for debug command
ai config-model debug openai gpt-4
```

### Listing Model Configuration

View your current model configuration:

```bash
ai config-model list
```

## Output Directory

By default, the CLI creates a `.ai-cli` directory in your project root to store:
- Search results and analysis
- Collected TypeScript files
- Generated documentation
- Worktree state tracking
- Configuration files

You can add this to your `.gitignore`:
```
.ai-cli/
```

The directory structure will look like:
```
your-project/
├── .ai-cli/
│   ├── code_search_20240320_143045.md
│   ├── src_collection.txt
│   ├── src_collection_analysis.md
│   ├── config.json
│   └── worktrees.json
├── src/
│   ├── myfile.ts
│   └── myfile.md
└── ...
``` 