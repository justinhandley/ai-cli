import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { getWorktrees, clearWorktrees } from '../utils/worktree-state.js';
import { getGitConfig } from '../utils/model-config.js';

export const worktreeMergeAllCommand = new Command('worktree-merge-all')
    .description('Merge all worktrees created by AI CLI into target branch')
    .argument('[target-branch]', 'Branch to merge into (defaults to configured default branch)')
    .action(async (targetBranch?: string) => {
        try {
            const worktrees = await getWorktrees();
            
            if (worktrees.length === 0) {
                console.log(chalk.yellow('No worktrees found to merge.'));
                return;
            }

            // Get the target branch (either provided or from config)
            const gitConfig = await getGitConfig();
            const finalTargetBranch = targetBranch || gitConfig.defaultBranch;

            // Verify we're on target branch
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
            if (currentBranch !== finalTargetBranch) {
                throw new Error(`Must be on ${finalTargetBranch} branch to merge worktrees`);
            }

            console.log(chalk.blue(`\nMerging all worktrees into '${finalTargetBranch}'...\n`));

            // Process each worktree
            for (const wt of worktrees) {
                try {
                    console.log(chalk.green(`Processing branch: ${wt.branch}`));

                    // Verify worktree still exists
                    try {
                        execSync('git rev-parse --git-dir', { cwd: wt.path });
                    } catch {
                        console.log(chalk.yellow(`Worktree at ${wt.path} no longer exists, skipping...`));
                        continue;
                    }

                    // Check for uncommitted changes
                    try {
                        execSync('git diff --quiet', { cwd: wt.path });
                    } catch {
                        console.log('Found uncommitted changes. Staging and committing...');
                        execSync('git add .', { cwd: wt.path });
                        execSync('git commit -m "chore: commit changes before merge"', { cwd: wt.path });
                    }

                    // Merge the branch
                    console.log(`Merging '${wt.branch}' into '${finalTargetBranch}'...`);
                    execSync(`git merge "${wt.branch}" -m "feat: merge changes from '${wt.branch}'"`);

                    // Clean up worktree
                    console.log(`Cleaning up worktree for '${wt.branch}'...`);
                    execSync(`git worktree remove "${wt.path}" --force`);

                    // Delete the branch
                    execSync(`git branch -D "${wt.branch}"`);

                    console.log(chalk.green(`Successfully merged '${wt.branch}'\n`));
                } catch (error) {
                    console.error(chalk.red(`Error processing '${wt.branch}':`, error));
                    console.log('Continuing with next worktree...\n');
                }
            }

            // Clear the worktree state
            await clearWorktrees();

            console.log(chalk.green(`All worktrees have been merged into '${finalTargetBranch}' and cleaned up.`));
        } catch (error) {
            console.error(chalk.red('Error merging worktrees:'), error);
            process.exit(1);
        }
    }); 