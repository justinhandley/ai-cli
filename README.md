# AI CLI

A command-line interface for interacting with various AI services and development tools.

## Installation

Install the package globally using npm:

    npm install -g @justinhandley/ai-cli

Or using pnpm:

    pnpm install -g @justinhandley/ai-cli

## Usage

The CLI can be accessed using the `ai` command.

### Configure API Keys

Store API keys securely for different AI services:

    ai config <service> <apiKey>

Get help with finding API keys:

    ai config-help [service]

Examples:
```bash
# Get help for all supported services
ai config-help

# Get help for a specific service
ai config-help anthropic
ai config-help github
```

Supported services:
- anthropic (Claude)
- github (for search functionality)
- google-studio
- openai

Example:

    ai config anthropic sk-ant-xxxxx
    ai config github ghp_xxxxx

You can generate a GitHub token at: https://github.com/settings/tokens
Required GitHub token permissions: `repo` (for searching private repositories)

### List Configured Services

View which services are configured:

    ai config-list

This will show a list of all supported services and whether they have been configured.

### Search & Troubleshooting

Search GitHub issues and Stack Overflow for coding problems, then get AI-powered analysis:

#### Interactive Mode (Recommended)

```bash
ai search interactive
```

This will:
- Prompt you to paste your error message
- Accept multi-line text input (press Enter twice when done)
- Search GitHub issues and Stack Overflow
- Generate an AI analysis with Claude
- Save everything to a file and display a preview

#### Direct Search Mode

```bash
ai search "Your error message here"
```

Options:
- `--github-limit <number>` - Number of GitHub issues to search (default: 3)
- `--stackoverflow-limit <number>` - Number of Stack Overflow posts to search (default: 3)

Example:
```bash
ai search "TypeError: Cannot read property 'map' of undefined" --github-limit 5
```

### Debug Code

Get AI-powered debugging assistance for your code:

```bash
ai debug
```

This command will:
- Prompt you to paste your error messages (press Enter after each line, then CTRL+D when finished)
- Optionally accept a code snippet for context
- Use GPT-4 to analyze the errors and provide:
  - Reasoning-based analysis of what's going wrong
  - Step-by-step debugging strategies
  - Suggested code changes if applicable

Example usage:
```bash
$ ai debug
Paste errors (press Enter after each line, then CTRL+D when finished):
TypeError: Cannot read property 'map' of undefined
    at MyComponent (./src/components/MyComponent.tsx:15:8)
    at renderWithHooks (./node_modules/react-dom/cjs/react-dom.development.js:14803:9)
^D

Errors received. Now, paste code snippet (or just press enter to skip):
const MyComponent = ({ data }) => {
  return data.map(item => <div>{item.name}</div>);
};

### Collect TypeScript Files

Collect and concatenate TypeScript files for AI processing:

    ai collect [path]

This command will:
- Search for `.ts` and `.tsx` files recursively in the specified directory
- Concatenate them into a single file in the `tmp` folder
- Open the folder containing the output file
- Exclude test files and files in node_modules/dist directories

Example:

    ai collect ./src

If no path is specified, the current directory will be used.

### Generate Code Documentation

Generate English documentation from code files using AI:

    ai describe <file> [options]

This command will:
- Read the specified code file
- Generate a detailed English description of the code's functionality
- Save the description as a markdown file

Options:
- `-o, --output <path>` - Specify output file path (default: <input>.md)

Example:
```bash
# Generate documentation for a TypeScript file
ai describe src/myfile.ts

# Generate documentation with custom output path
ai describe src/myfile.ts -o docs/description.md
```

The generated documentation will include:
- Overview of the code's purpose
- Description of functions and classes
- Step-by-step behavior flow
- Key implementation details and considerations

### Summarize Text (Coming Soon)

Summarize text using AI:

    ai summarize "Your text here"

## Output Files

The tool saves analysis results in a `.ai-cli` directory in your project root. Files are named with the format `code_search_TIMESTAMP.md` and include:
- A summary of the issue
- Timestamp of when the analysis was generated
- List of all sources with URLs
- Detailed AI analysis

Example output file:
```markdown
# Code Search Analysis: TypeError: Cannot read property 'map' of undefined React

*Generated on 2025-03-20 14:30:45*

## Summary

The "TypeError: Cannot read property 'map' of undefined" error in React occurs when...
[Full analysis from Claude appears here...]

## Sources

1. [TypeError: Cannot read property 'map' of undefined when using React](https://github.com/facebook/react/issues/12345) (GitHub Issue)
2. [React - TypeError: Cannot read property 'map' of undefined](https://stackoverflow.com/questions/12345678) (Stack Overflow)
3. [How to fix map of undefined error in React components](https://github.com/reactjs/reactjs.org/issues/5678) (GitHub Issue)
```

### File Organization

The tool creates a `.ai-cli` directory in your project root to store analysis files. You may want to:

1. Add this to your .gitignore:
