---
sidebar_position: 3
---

# Configuration

AI CLI can be configured with various API keys and AI models to suit your needs.

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
│   └── src_collection_analysis.md
├── src/
│   ├── myfile.ts
│   └── myfile.md
└── ...
``` 