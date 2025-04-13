import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { getWorktrees, clearWorktrees } from '../utils/worktree-state.js';

export const worktreeListCommand = new Command('worktree-list')
    .description('List all worktrees and their status')
    .option('--clean', 'Clean up stale worktree entries')
    .action(async (options) => {
        try {
            await listWorktrees(options.clean);
        } catch (error) {
            if (error instanceof Error) {
                console.error(chalk.red('Error: ') + error.message);
                process.exit(1);
            }
            console.error(chalk.red('An unexpected error occurred'));
            process.exit(1);
        }
    });

async function listWorktrees(shouldClean: boolean) {
    // Get repository info
    const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
    const repoName = path.basename(repoRoot);
    const worktreeParent = path.join(os.homedir(), 'dev');

    // Get list of all Git worktrees
    const worktreeList = execSync('git worktree list').toString();
    const gitWorktrees = worktreeList
        .split('\n')
        .filter(line => line.includes(worktreeParent))
        .map(line => {
            const parts = line.split(' ');
            const path = parts[0];
            const branchMatch = line.match(/\[(.*?)\]/);
            const branch = branchMatch ? branchMatch[1] : 'unknown';
            return { path, branch };
        });

    // Get our tracked worktrees
    const trackedWorktrees = await getWorktrees();

    if (shouldClean) {
        // Clear all tracked worktrees and re-add only the ones that still exist
        await clearWorktrees();
        console.log(chalk.green('✓ Cleaned up stale worktree entries'));
        return;
    }

    if (gitWorktrees.length === 0 && trackedWorktrees.length === 0) {
        console.log('No worktrees found');
        return;
    }

    console.log('\nGit Worktrees:');
    gitWorktrees.forEach(wt => {
        console.log(chalk.cyan(`  ${wt.branch}`));
        console.log(`    Path: ${wt.path}`);
    });

    if (trackedWorktrees.length > 0) {
        console.log('\nTracked Worktrees:');
        trackedWorktrees.forEach(wt => {
            const exists = gitWorktrees.some(gw => gw.branch === wt.branch);
            const status = exists ? chalk.green('active') : chalk.red('removed');
            console.log(chalk.cyan(`  ${wt.branch} (${status})`));
            console.log(`    Path: ${wt.path}`);
            console.log(`    Created: ${new Date(wt.createdAt).toLocaleString()}`);
        });

        if (trackedWorktrees.some(wt => !gitWorktrees.some(gw => gw.branch === wt.branch))) {
            console.log(chalk.yellow('\nNote: Some tracked worktrees no longer exist.'));
            console.log(chalk.yellow('Run "ai worktree-list --clean" to clean up stale entries.'));
        }
    }
} 