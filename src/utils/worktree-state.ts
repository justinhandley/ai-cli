import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { OUTPUT_DIR_NAME } from './constants.js';

interface WorktreeInfo {
    branch: string;
    path: string;
    createdAt: string;
}

const WORKTREE_STATE_FILE = 'worktrees.json';

export async function addWorktree(branch: string, worktreePath: string): Promise<void> {
    const worktrees = await loadWorktreeState();
    worktrees.push({
        branch,
        path: worktreePath,
        createdAt: new Date().toISOString()
    });
    await saveWorktreeState(worktrees);
}

export async function removeWorktree(branch: string): Promise<void> {
    const worktrees = await loadWorktreeState();
    const filteredWorktrees = worktrees.filter(wt => wt.branch !== branch);
    await saveWorktreeState(filteredWorktrees);
}

export async function getWorktrees(): Promise<WorktreeInfo[]> {
    return loadWorktreeState();
}

export async function clearWorktrees(): Promise<void> {
    await saveWorktreeState([]);
}

async function loadWorktreeState(): Promise<WorktreeInfo[]> {
    try {
        const statePath = path.join(process.cwd(), OUTPUT_DIR_NAME, WORKTREE_STATE_FILE);
        const stateContent = await readFile(statePath, 'utf8');
        return JSON.parse(stateContent);
    } catch (error) {
        // If state doesn't exist or is invalid, return empty array
        return [];
    }
}

async function saveWorktreeState(worktrees: WorktreeInfo[]): Promise<void> {
    const stateDir = path.join(process.cwd(), OUTPUT_DIR_NAME);
    await mkdir(stateDir, { recursive: true });
    
    const statePath = path.join(stateDir, WORKTREE_STATE_FILE);
    await writeFile(statePath, JSON.stringify(worktrees, null, 2), 'utf8');
} 