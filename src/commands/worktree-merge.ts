import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import { getGitConfig } from '../utils/model-config.js';

export const worktreeMergeCommand = new Command('worktree-merge')
  .description('Merge changes from a worktree branch into target branch')
  .argument('<branch>', 'Branch to merge')
  .argument('[target-branch]', 'Branch to merge into (defaults to configured default branch)')
  .action(async (branch: string, targetBranch?: string) => {
    try {
      await mergeWorktree(branch, targetBranch);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  });

async function mergeWorktree(branchToMerge: string, targetBranch?: string) {
  // Get repository info
  const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
  const repoName = path.basename(repoRoot);
  const worktreeParent = path.join(os.homedir(), 'dev');

  // Get the target branch (either provided or from config)
  const gitConfig = await getGitConfig();
  const finalTargetBranch = targetBranch || gitConfig.defaultBranch;

  // Verify we're on target branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (currentBranch !== finalTargetBranch) {
    throw new Error(`Must be on ${finalTargetBranch} branch to merge worktrees`);
  }

  // Find the specific worktree for the branch to merge
  const worktreeList = execSync('git worktree list').toString();
  const worktreePath = worktreeList
    .split('\n')
    .find(line => line.includes(worktreeParent) && line.includes(branchToMerge))
    ?.split(' ')[0];

  if (!worktreePath) {
    throw new Error(`No worktree found for branch '${branchToMerge}'`);
  }

  // Check for uncommitted changes in the worktree
  try {
    execSync('git diff --quiet', { cwd: worktreePath });
  } catch {
    console.log('Found uncommitted changes in worktree. Staging and committing...');
    execSync('git add .', { cwd: worktreePath });
    execSync('git commit -m "chore: commit changes before merge"', { cwd: worktreePath });
  }

  // Merge the branch
  console.log(`Merging branch '${branchToMerge}' into '${finalTargetBranch}'...`);
  execSync(`git merge "${branchToMerge}" -m "feat: merge changes from '${branchToMerge}'"`);

  // Clean up only this specific worktree
  console.log(`Cleaning up worktree for branch '${branchToMerge}'...`);
  execSync(`git worktree remove "${worktreePath}" --force`);

  // Delete the branch
  execSync(`git branch -D "${branchToMerge}"`);

  console.log(`Merge complete: Branch '${branchToMerge}' merged into '${finalTargetBranch}', and worktree cleaned up.`);
} 