import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { removeWorktree as removeWorktreeState } from '../utils/worktree-state.js';

export const worktreeRemoveCommand = new Command('worktree-remove')
  .description('Remove a worktree without merging changes')
  .argument('<branch>', 'Branch name of the worktree to remove')
  .action(async (branch: string) => {
    try {
      await removeWorktree(branch);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error: ') + error.message);
        process.exit(1);
      }
      console.error(chalk.red('An unexpected error occurred'));
      process.exit(1);
    }
  });

async function removeWorktree(branch: string) {
  // Get repository info
  const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
  const repoName = path.basename(repoRoot);
  const worktreeParent = path.join(os.homedir(), 'dev');

  // Get list of all worktrees
  const worktreeList = execSync('git worktree list').toString();
  const worktrees = worktreeList
    .split('\n')
    .filter(line => line.includes(worktreeParent))
    .map(line => {
      const parts = line.split(' ');
      const path = parts[0];
      const branchMatch = line.match(/\[(.*?)\]/);
      const branch = branchMatch ? branchMatch[1] : 'unknown';
      return { path, branch };
    });

  if (worktrees.length === 0) {
    console.log('No worktrees found');
    return;
  }

  // Find the target worktree
  const targetWorktree = worktrees.find(wt => 
    wt.branch === branch || 
    wt.branch === `jbh/${branch}` || 
    wt.branch === `feature/${branch}`
  );

  if (!targetWorktree) {
    const availableBranches = worktrees
      .map(wt => chalk.cyan(wt.branch))
      .join('\n  ');
    throw new Error(
      `No worktree found for branch '${chalk.yellow(branch)}'\n` +
      `Available worktree branches:\n  ${availableBranches}\n` +
      `Note: Make sure to use the full branch name if it includes a prefix (e.g. ${chalk.green('jbh/branch-name')})`
    );
  }

  let hasUncommittedChanges = false;
  // Check for uncommitted changes
  try {
    execSync('git diff --quiet', { cwd: targetWorktree.path });
  } catch {
    hasUncommittedChanges = true;
    console.log(chalk.yellow('\nWarning: Found uncommitted changes in worktree. These changes will be lost.'));
    console.log(chalk.blue('Use "ai worktree-merge" to merge changes before removing.'));
    console.log('\nPress Ctrl+C to abort or Enter to continue...');
    await new Promise(resolve => process.stdin.once('data', resolve));
  }

  // Remove the worktree
  console.log(chalk.blue(`\nRemoving worktree for branch '${targetWorktree.branch}'...`));
  execSync(`git worktree remove "${targetWorktree.path}" --force`);

  // Delete the branch if it's not main
  if (targetWorktree.branch !== 'main') {
    console.log(chalk.blue(`Deleting branch '${targetWorktree.branch}'...`));
    execSync(`git branch -D "${targetWorktree.branch}"`);
  }

  // Remove from our local state
  await removeWorktreeState(targetWorktree.branch);

  console.log(chalk.green(`\n✓ Worktree for branch '${targetWorktree.branch}' removed successfully.`));
  process.exit(0);
} 