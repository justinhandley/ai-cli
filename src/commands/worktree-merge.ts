import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

export const worktreeMergeCommand = new Command('worktree-merge')
  .description('Merge changes from a worktree branch into main and clean up worktrees')
  .argument('<branch>', 'Branch to merge into main')
  .action(async (branch: string) => {
    try {
      await mergeWorktree(branch);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  });

async function mergeWorktree(branchToKeep: string) {
  // Get repository info
  const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
  const repoName = path.basename(repoRoot);
  const worktreeParent = path.join(os.homedir(), 'dev');

  // Verify we're on main branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (currentBranch !== 'main') {
    throw new Error('Must be on main branch to merge worktrees');
  }

  // Get list of all worktrees
  const worktreeList = execSync('git worktree list').toString();
  const worktrees = worktreeList
    .split('\n')
    .filter(line => line.includes(worktreeParent))
    .map(line => line.split(' ')[0]);

  if (worktrees.length === 0) {
    console.log('No worktrees found to clean up');
    return;
  }

  // Verify the branch to keep exists
  const targetWorktree = worktrees.find(wt => wt.includes(branchToKeep));
  if (!targetWorktree) {
    throw new Error(`No worktree found for branch '${branchToKeep}'`);
  }

  // Check for uncommitted changes in the target worktree
  try {
    execSync('git diff --quiet', { cwd: targetWorktree });
  } catch {
    console.log('Found uncommitted changes in target worktree. Staging and committing...');
    execSync('git add .', { cwd: targetWorktree });
    execSync('git commit -m "chore: commit changes before merge"', { cwd: targetWorktree });
  }

  // Merge the target branch into main
  console.log(`Merging branch '${branchToKeep}' into 'main'...`);
  execSync(`git merge "${branchToKeep}" -m "feat: merge changes from '${branchToKeep}'"`);

  // Clean up worktrees
  console.log('Cleaning up worktrees and deleting temporary branches...');
  for (const wt of worktrees) {
    const wtBranch = path.basename(wt).replace(`${repoName}-`, '');
    console.log(`Processing worktree for branch '${wtBranch}' at ${wt}...`);

    // Remove worktree
    execSync(`git worktree remove "${wt}" --force`);

    // Delete branch if not main
    if (wtBranch !== 'main') {
      execSync(`git branch -D "${wtBranch}"`);
    }
  }

  console.log(`Merge complete: Branch '${branchToKeep}' merged into 'main', and all worktrees cleaned up.`);
} 