---
sidebar_position: 4
---

# Examples

Here are some practical examples of how to use AI CLI in your development workflow.

## Search for Solutions

### Debugging a TypeScript Error
```bash
ai search "TypeError: Cannot read property 'map' of undefined in React component"
```

This will:
1. Search GitHub issues and Stack Overflow for similar errors
2. Analyze the results with AI
3. Provide a detailed solution with code examples

### Finding Best Practices
```bash
ai search "React hooks best practices useEffect cleanup"
```

### Troubleshooting Build Issues
```bash
ai search "pnpm install error ENOENT: no such file or directory"
```

## Generate Documentation

### Document a React Component
```bash
ai describe src/components/UserProfile.tsx
```

This will create `src/components/UserProfile.md` with:
- Component overview
- Props documentation
- Usage examples
- Key implementation details

### Document an API Service
```bash
ai describe src/services/api.ts
```

## Debug Code

### Debug a Complex Error
```bash
ai debug
# Then paste your error:
TypeError: Cannot read property 'map' of undefined
    at UserList (./src/components/UserList.tsx:15:8)
    at renderWithHooks (./node_modules/react-dom/cjs/react-dom.development.js:14803:9)
^D

# Then paste the relevant code:
const UserList = ({ users }) => {
  return users.map(user => <UserCard key={user.id} user={user} />);
};
```

## Collect and Analyze Code

### Analyze a Feature
```bash
# Collect all TypeScript files in the feature directory
ai collect ./src/features/user-management

# This will:
# 1. Create a concatenated file in .ai-cli/user-management.txt
# 2. Generate an analysis in .ai-cli/user-management_analysis.md
```

### Review a Module
```bash
# Collect and analyze a specific module
ai collect ./src/utils
```

## Configuration Examples

### Set Up Multiple AI Models
```bash
# Use Claude for search (faster, good for general queries)
ai config-model search anthropic claude-3-haiku-20240307

# Use GPT-4 for debugging (more detailed analysis)
ai config-model debug openai gpt-4

# Use Claude for documentation (good balance of speed and quality)
ai config-model describe anthropic claude-3-sonnet-20240229
```

### Configure API Keys
```bash
# Set up Anthropic API key
ai config anthropic sk-ant-xxxxx

# Set up GitHub token for search
ai config github ghp_xxxxx

# Verify configuration
ai config-list
```

## Real-World Workflow

Here's a complete example of using AI CLI in a typical development workflow:

1. **Start a New Feature**
```bash
# Collect existing code to understand the codebase
ai collect ./src/features
```

2. **Debug an Issue**
```bash
# Get AI-powered debugging help
ai debug
# Paste error and code
```

3. **Search for Solutions**
```bash
# Find similar implementations
ai search "React form validation with TypeScript"
```

4. **Document Your Code**
```bash
# Generate documentation for new components
ai describe src/features/new-feature/components/Form.tsx
```

5. **Review Changes**
```bash
# Collect and analyze modified files
ai collect ./src/features/new-feature
```

## Tips and Best Practices

1. **Use Search with Specific Limits**
```bash
# Get more detailed results
ai search "React hooks" -g 5 -s 5
```

2. **Combine Commands**
```bash
# Generate documentation and then search for improvements
ai describe src/components/DataTable.tsx
ai search "React table component best practices"
```

3. **Use Interactive Debug Mode**
```bash
ai debug
# Take your time to paste the complete error stack trace
# Then provide relevant code context
```

4. **Keep Documentation Up to Date**
```bash
# After making changes, regenerate documentation
ai describe src/components/UpdatedComponent.tsx
``` 