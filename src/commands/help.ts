import { Command } from 'commander';
import chalk from 'chalk';

const helpCommand = new Command('help')
    .description('Show help information for all commands')
    .action(async () => {
        console.log(chalk.blue.bold('\nAI CLI Commands\n'));
        console.log(chalk.gray('Usage: ai <command> [options]\n'));
        
        console.log(chalk.yellow.bold('Commands:'));
        console.log(chalk.gray('  search <query>              Search for code solutions and troubleshooting'));
        console.log(chalk.gray('    -g, --github-limit <n>    Number of GitHub issues to search (default: 3)'));
        console.log(chalk.gray('    -s, --stackoverflow-limit <n>  Number of Stack Overflow posts to search (default: 3)'));
        console.log(chalk.gray('  collect [directory]         Collect TypeScript files from a directory'));
        console.log(chalk.gray('  config <service> <key>      Set API key for a service'));
        console.log(chalk.gray('  config-list                List all configured API keys'));
        console.log(chalk.gray('  config-help <service>      Show help for configuring a specific service'));
        console.log(chalk.gray('  config-model <cmd> <svc>   Configure which AI model to use for each command'));
        console.log(chalk.gray('  config-model list          List current model configuration'));
        console.log(chalk.gray('  describe <file>            Generate English documentation from code files'));
        console.log(chalk.gray('  worktree [options] <branches...>  Create multiple Git worktrees for parallel development'));
        console.log(chalk.gray('    -p, --pnpm               Install dependencies using pnpm in each worktree'));
        console.log(chalk.gray('  worktree-merge <branch>    Merge changes from a worktree branch into main and clean up'));
        console.log(chalk.gray('  worktree-remove <branch>   Remove a worktree without merging changes'));
        console.log(chalk.gray('  help                       Show this help message\n'));

        console.log(chalk.yellow.bold('Options:'));
        console.log(chalk.gray('  -h, --help                 Display help for command'));
        console.log(chalk.gray('  -V, --version              Output the version number\n'));

        console.log(chalk.yellow.bold('Examples:'));
        console.log(chalk.gray('  ai search "how to handle errors"'));
        console.log(chalk.gray('  ai search "typescript error" -g 5 -s 5'));
        console.log(chalk.gray('  ai collect ./src'));
        console.log(chalk.gray('  ai config anthropic your-api-key'));
        console.log(chalk.gray('  ai config-help anthropic'));
        console.log(chalk.gray('  ai config-model search anthropic claude-3-haiku-20240307'));
        console.log(chalk.gray('  ai config-model list'));
        console.log(chalk.gray('  ai describe src/myfile.ts'));
        console.log(chalk.gray('  ai describe src/myfile.ts -o docs/description.md'));
        console.log(chalk.gray('  ai worktree -p feature-a feature-b feature-c'));
        console.log(chalk.gray('  ai worktree-merge feature-a'));
        console.log(chalk.gray('  ai worktree-remove feature-a\n'));

        console.log(chalk.yellow.bold('For more information:'));
        console.log(chalk.gray('  Run "ai <command> --help" for more information about a command'));
    });

export { helpCommand }; 