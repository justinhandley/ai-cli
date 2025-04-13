import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { getWorktrees } from '../utils/worktree-state.js';

export const worktreeListCommand = new Command('worktree-list')
    .description('List worktrees created by AI CLI')
    .action(async () => {
        try {
            const worktrees = await getWorktrees();
            
            if (worktrees.length === 0) {
                console.log(chalk.yellow('No worktrees created by AI CLI found.'));
                return;
            }

            console.log(chalk.blue('\nWorktrees created by AI CLI:\n'));
            
            for (const wt of worktrees) {
                // Check if the worktree still exists
                let status = '';
                try {
                    execSync('git rev-parse --git-dir', { cwd: wt.path });
                    status = chalk.green('Active');
                } catch {
                    status = chalk.red('Removed');
                }

                console.log(chalk.green(`Branch: ${wt.branch}`));
                console.log(chalk.gray(`  Path: ${wt.path}`));
                console.log(chalk.gray(`  Created: ${new Date(wt.createdAt).toLocaleString()}`));
                console.log(chalk.gray(`  Status: ${status}\n`));
            }
        } catch (error) {
            console.error(chalk.red('Error listing worktrees:'), error);
            process.exit(1);
        }
    }); 