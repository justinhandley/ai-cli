import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { execSync } from 'child_process';
import { mkdir, rm, access } from 'fs/promises';
import path from 'path';
import os from 'os';
import { worktreeCommand } from '../worktree.js';
import { worktreeMergeCommand } from '../worktree-merge.js';

// Mock execSync to avoid actual git commands
vi.mock('child_process', () => ({
    execSync: vi.fn()
}));

// Mock fs operations
vi.mock('fs/promises', () => ({
    mkdir: vi.fn(),
    rm: vi.fn(),
    access: vi.fn()
}));

const TEST_DIR = path.join(process.cwd(), 'test-fixtures');
const WORKTREE_PARENT = path.join(os.homedir(), 'dev');

describe('worktree command', () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();
        
        // Mock git commands
        (execSync as any).mockImplementation((command: string) => {
            if (command === 'git rev-parse --show-toplevel') return TEST_DIR;
            if (command === 'git rev-parse --abbrev-ref HEAD') return 'main';
            if (command === 'git worktree list') return '';
            if (command.includes('git show-ref')) return '';
            if (command.includes('git worktree add')) return '';
            if (command.includes('pnpm install')) return '';
            if (command.includes('cursor')) return '';
            return '';
        });
    });

    afterEach(async () => {
        // Clean up test files
        await rm(TEST_DIR, { recursive: true, force: true });
    });

    test('creates worktrees for multiple branches', async () => {
        const command = worktreeCommand;
        
        // Execute the command with multiple branches
        await command.parseAsync(['node', 'test', 'feature-a', 'feature-b']);
        
        // Verify git commands were called correctly
        expect(execSync).toHaveBeenCalledWith('git rev-parse --show-toplevel');
        expect(execSync).toHaveBeenCalledWith('git rev-parse --abbrev-ref HEAD');
        expect(execSync).toHaveBeenCalledWith('git worktree list');
        
        // Verify worktrees were created for both branches
        expect(execSync).toHaveBeenCalledWith(
            `git worktree add "${path.join(WORKTREE_PARENT, 'test-fixtures-feature-a')}" "feature-a"`
        );
        expect(execSync).toHaveBeenCalledWith(
            `git worktree add "${path.join(WORKTREE_PARENT, 'test-fixtures-feature-b')}" "feature-b"`
        );
    });

    test('installs dependencies when --pnpm flag is used', async () => {
        const command = worktreeCommand;
        
        // Execute the command with --pnpm flag
        await command.parseAsync(['node', 'test', '--pnpm', 'feature-a']);
        
        // Verify pnpm install was called
        expect(execSync).toHaveBeenCalledWith(
            'pnpm install',
            expect.objectContaining({ cwd: expect.stringContaining('feature-a') })
        );
    });

    test('skips existing worktrees', async () => {
        const command = worktreeCommand;
        
        // Mock existing worktree
        (execSync as any).mockImplementation((command: string) => {
            if (command === 'git worktree list') {
                return `${path.join(WORKTREE_PARENT, 'test-fixtures-feature-a')} feature-a`;
            }
            return '';
        });
        
        // Execute the command
        await command.parseAsync(['node', 'test', 'feature-a', 'feature-b']);
        
        // Verify worktree creation was skipped for existing branch
        expect(execSync).not.toHaveBeenCalledWith(
            expect.stringContaining('git worktree add'),
            expect.any(Object)
        );
    });
});

describe('worktree-merge command', () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();
        
        // Mock git commands
        (execSync as any).mockImplementation((command: string) => {
            if (command === 'git rev-parse --show-toplevel') return TEST_DIR;
            if (command === 'git rev-parse --abbrev-ref HEAD') return 'main';
            if (command === 'git worktree list') {
                return `${path.join(WORKTREE_PARENT, 'test-fixtures-feature-a')} feature-a\n` +
                       `${path.join(WORKTREE_PARENT, 'test-fixtures-feature-b')} feature-b`;
            }
            if (command.includes('git worktree remove')) return '';
            if (command.includes('git branch -D')) return '';
            if (command.includes('git merge')) return '';
            return '';
        });
    });

    afterEach(async () => {
        // Clean up test files
        await rm(TEST_DIR, { recursive: true, force: true });
    });

    test('merges specified branch and cleans up worktrees', async () => {
        const command = worktreeMergeCommand;
        
        // Execute the command
        await command.parseAsync(['node', 'test', 'feature-a']);
        
        // Verify merge was performed
        expect(execSync).toHaveBeenCalledWith(
            'git merge "feature-a" -m "feat: merge changes from \'feature-a\'"'
        );
        
        // Verify worktrees were removed
        expect(execSync).toHaveBeenCalledWith(
            `git worktree remove "${path.join(WORKTREE_PARENT, 'test-fixtures-feature-a')}" --force`
        );
        expect(execSync).toHaveBeenCalledWith(
            `git worktree remove "${path.join(WORKTREE_PARENT, 'test-fixtures-feature-b')}" --force`
        );
    });

    test('fails when not on main branch', async () => {
        const command = worktreeMergeCommand;
        
        // Mock being on a different branch
        (execSync as any).mockImplementation((command: string) => {
            if (command === 'git rev-parse --abbrev-ref HEAD') return 'develop';
            return '';
        });
        
        // Execute the command and expect it to fail
        await expect(command.parseAsync(['node', 'test', 'feature-a']))
            .rejects
            .toThrow('Must be on main branch to merge worktrees');
    });

    test('handles uncommitted changes in target worktree', async () => {
        const command = worktreeMergeCommand;
        
        // Mock git diff to indicate uncommitted changes
        (execSync as any).mockImplementation((command: string) => {
            if (command === 'git diff --quiet') {
                throw new Error('Uncommitted changes');
            }
            return '';
        });
        
        // Execute the command
        await command.parseAsync(['node', 'test', 'feature-a']);
        
        // Verify changes were committed
        expect(execSync).toHaveBeenCalledWith(
            'git add .',
            expect.objectContaining({ cwd: expect.stringContaining('feature-a') })
        );
        expect(execSync).toHaveBeenCalledWith(
            'git commit -m "chore: commit changes before merge"',
            expect.objectContaining({ cwd: expect.stringContaining('feature-a') })
        );
    });
}); 