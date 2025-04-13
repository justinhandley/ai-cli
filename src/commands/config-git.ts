import { Command } from 'commander';
import chalk from 'chalk';
import { getGitConfig, setGitDefaultBranch } from '../utils/model-config.js';

export const configGitCommand = new Command('config-git')
    .description('Configure Git settings')
    .command('default-branch')
    .description('Set the default branch for Git operations')
    .argument('<branch>', 'Name of the default branch (e.g., develop, main)')
    .action(async (branch: string) => {
        try {
            await setGitDefaultBranch(branch);
            console.log(chalk.green(`Default branch set to '${branch}'`));
        } catch (error) {
            console.error(chalk.red('Error configuring default branch:'), error);
            process.exit(1);
        }
    });

configGitCommand
    .command('show')
    .description('Show current Git configuration')
    .action(async () => {
        try {
            const config = await getGitConfig();
            console.log(chalk.blue('\nCurrent Git Configuration:\n'));
            console.log(chalk.green('Default Branch:'), chalk.gray(config.defaultBranch));
        } catch (error) {
            console.error(chalk.red('Error showing Git configuration:'), error);
            process.exit(1);
        }
    }); 