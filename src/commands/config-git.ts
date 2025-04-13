import { Command } from 'commander';
import { getGitConfig, setGitConfig } from '../utils/model-config.js';
import chalk from 'chalk';

export function configGitCommand(): Command {
    const command = new Command('config-git');
    command
        .description('Configure git settings')
        .option('-d, --default-branch <branch>', 'Set default branch name')
        .action(async (options) => {
            const config = getGitConfig();
            if (options.defaultBranch) {
                setGitConfig(options.defaultBranch);
                console.log(chalk.green(`Default branch set to: ${options.defaultBranch}`));
            } else {
                console.log(chalk.blue('Current git configuration:'));
                console.log(chalk.blue(`Default branch: ${config.defaultBranch}`));
            }
        });
    return command;
} 