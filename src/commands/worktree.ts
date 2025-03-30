import { Command } from 'commander';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

interface WorktreeOptions {
  pnpm?: boolean;
  branches: string[];
}

export const worktreeCommand = new Command('worktree')
  .description('Create and manage Git worktrees for parallel development')
  .option('-p, --pnpm', 'Install dependencies using pnpm')
  .argument('<branches...>', 'Branch names to create worktrees for')
  .action(async (branches: string[], options: WorktreeOptions) => {
    try {
      await createWorktrees(branches, options);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

async function createWorktrees(branches: string[], options: WorktreeOptions) {
  // Get current repository info
  const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
  const repoName = path.basename(repoRoot);
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  // Set up worktree parent directory
  const worktreeParent = path.join(os.homedir(), 'dev');
  if (!existsSync(worktreeParent)) {
    mkdirSync(worktreeParent, { recursive: true });
  }

  // Process each branch
  for (const branch of branches) {
    const targetPath = path.join(worktreeParent, `${repoName}-${branch}`);
    console.log(`Processing branch: ${branch}`);

    // Check if worktree already exists
    const worktreeList = execSync('git worktree list').toString();
    if (worktreeList.includes(targetPath)) {
      console.log(`Worktree already exists at ${targetPath}. Skipping branch '${branch}'.`);
      continue;
    }

    // Create branch if it doesn't exist
    try {
      execSync(`git show-ref --verify --quiet refs/heads/${branch}`, { stdio: 'ignore' });
    } catch {
      console.log(`Branch '${branch}' does not exist. Creating it from '${currentBranch}'...`);
      execSync(`git branch ${branch}`);
    }

    // Create worktree
    console.log(`Creating worktree for branch '${branch}' at ${targetPath}...`);
    execSync(`git worktree add "${targetPath}" "${branch}"`);

    // Install dependencies if requested
    if (options.pnpm) {
      console.log(`Installing dependencies in worktree for branch '${branch}'...`);
      execSync('pnpm install', { cwd: targetPath });
    }

    // Launch Cursor if available
    try {
      execSync(`cursor "${targetPath}"`);
    } catch {
      console.log(`Worktree created at: ${targetPath}`);
    }

    console.log(`Worktree for branch '${branch}' created successfully.`);
    console.log('-----------------------------------------------------');
  }
} 