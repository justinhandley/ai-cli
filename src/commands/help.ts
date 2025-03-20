import { Command } from 'commander';
import chalk from 'chalk';

const helpCommand = new Command('help')
    .description('Show help information for all commands')
    .action(async () => {
        console.log(chalk.blue.bold('\nAI CLI Commands\n'));
        console.log(chalk.gray('Usage: ai <command> [options]\n'));
        
        console.log(chalk.yellow.bold('Commands:'));
        console.log(chalk.gray('  search <query>              Search for code solutions and troubleshooting'));
        console.log(chalk.gray('  collect [directory]         Collect TypeScript files from a directory'));
        console.log(chalk.gray('  config <service> <key>      Set API key for a service'));
        console.log(chalk.gray('  config-list                List all configured API keys'));
        console.log(chalk.gray('  config-help <service>      Show help for configuring a specific service'));
        console.log(chalk.gray('  help                       Show this help message\n'));

        console.log(chalk.yellow.bold('Options:'));
        console.log(chalk.gray('  -h, --help                 Display help for command'));
        console.log(chalk.gray('  -V, --version              Output the version number\n'));

        console.log(chalk.yellow.bold('Examples:'));
        console.log(chalk.gray('  ai search "how to handle errors"'));
        console.log(chalk.gray('  ai collect ./src'));
        console.log(chalk.gray('  ai config anthropic your-api-key'));
        console.log(chalk.gray('  ai config-help anthropic\n'));

        console.log(chalk.yellow.bold('For more information:'));
        console.log(chalk.gray('  Run "ai <command> --help" for more information about a command'));
    });

export { helpCommand }; 