import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

export const worktreeRemoveCommand = new Command('worktree-remove')
  .description('Remove a worktree without merging changes')
  .argument('<branch>', 'Branch name of the worktree to remove')
  .action(async (branch: string) => {
    try {
      await removeWorktree(branch);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
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
    .map(line => line.split(' ')[0]);

  if (worktrees.length === 0) {
    console.log('No worktrees found');
    return;
  }

  // Find the target worktree
  const targetWorktree = worktrees.find(wt => wt.includes(branch));
  if (!targetWorktree) {
    throw new Error(`No worktree found for branch '${branch}'`);
  }

  // Check for uncommitted changes
  try {
    execSync('git diff --quiet', { cwd: targetWorktree });
  } catch {
    console.log('Warning: Found uncommitted changes in worktree. These changes will be lost.');
    console.log('Use "ai worktree-merge" to merge changes before removing.');
    console.log('Press Ctrl+C to abort or Enter to continue...');
    await new Promise(resolve => process.stdin.once('data', resolve));
  }

  // Remove the worktree
  console.log(`Removing worktree for branch '${branch}'...`);
  execSync(`git worktree remove "${targetWorktree}" --force`);

  // Delete the branch if it's not main
  if (branch !== 'main') {
    console.log(`Deleting branch '${branch}'...`);
    execSync(`git branch -D "${branch}"`);
  }

  console.log(`Worktree for branch '${branch}' removed successfully.`);
} 