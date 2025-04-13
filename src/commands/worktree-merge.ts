import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import { getGitConfig } from '../utils/model-config.js';
import { removeWorktree as removeWorktreeState } from '../utils/worktree-state.js';
import chalk from 'chalk';

export const worktreeMergeCommand = new Command('worktree-merge')
  .description('Merge changes from a worktree branch into target branch')
  .argument('<branch>', 'Branch to merge')
  .argument('[target-branch]', 'Branch to merge into (defaults to configured default branch)')
  .action(async (branch: string, targetBranch?: string) => {
    try {
      await mergeWorktree(branch, targetBranch);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error: ') + error.message);
        process.exit(1);
      }
      console.error(chalk.red('An unexpected error occurred'));
      process.exit(1);
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
    throw new Error(
      `Must be on ${chalk.cyan(finalTargetBranch)} branch to merge worktrees.\n` +
      `Current branch: ${chalk.yellow(currentBranch)}\n` +
      `Please run: ${chalk.green(`git checkout ${finalTargetBranch}`)}\n` +
      `Or specify a different target branch: ${chalk.green(`ai worktree-merge ${branchToMerge} ${currentBranch}`)}`
    );
  }

  // Find all available worktrees and branches
  const worktreeList = execSync('git worktree list').toString();
  const availableWorktrees = worktreeList
    .split('\n')
    .filter(line => line.includes(worktreeParent))
    .map(line => {
      const parts = line.split(' ');
      const path = parts[0];
      // The branch name is in square brackets at the end, like [branch-name]
      const branchMatch = line.match(/\[(.*?)\]/);
      const branch = branchMatch ? branchMatch[1] : 'unknown';
      return { path, branch };
    });

  // Find the specific worktree for the branch to merge
  const worktreeMatch = availableWorktrees.find(wt => 
    wt.branch === branchToMerge || 
    wt.branch === `jbh/${branchToMerge}` || // Check for common prefixes
    wt.branch === `feature/${branchToMerge}`
  );

  if (!worktreeMatch) {
    const availableBranches = availableWorktrees
      .map(wt => chalk.cyan(wt.branch))
      .join('\n  ');
    throw new Error(
      `No worktree found for branch '${chalk.yellow(branchToMerge)}'\n` +
      `Available worktree branches:\n  ${availableBranches}\n` +
      `Note: Make sure to use the full branch name if it includes a prefix (e.g. ${chalk.green('jbh/branch-name')})`
    );
  }

  const worktreePath = worktreeMatch.path;
  const actualBranch = worktreeMatch.branch;

  // Check for uncommitted changes in the worktree
  try {
    execSync('git diff --quiet', { cwd: worktreePath });
  } catch {
    console.log(chalk.yellow('Found uncommitted changes in worktree. Staging and committing...'));
    execSync('git add .', { cwd: worktreePath });
    execSync('git commit -m "chore: commit changes before merge"', { cwd: worktreePath });
  }

  // Merge the branch
  console.log(chalk.blue(`Merging branch '${actualBranch}' into '${finalTargetBranch}'...`));
  execSync(`git merge "${actualBranch}" -m "feat: merge changes from '${actualBranch}'"`);

  // Clean up only this specific worktree
  console.log(chalk.blue(`Cleaning up worktree for branch '${actualBranch}'...`));
  execSync(`git worktree remove "${worktreePath}" --force`);

  // Delete the branch
  execSync(`git branch -D "${actualBranch}"`);

  // Remove from our local state
  await removeWorktreeState(actualBranch);

  console.log(chalk.green(`✓ Merge complete: Branch '${actualBranch}' merged into '${finalTargetBranch}', and worktree cleaned up.`));
} 