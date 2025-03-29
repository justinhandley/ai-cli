import { describe, beforeEach, test, expect, vi } from 'vitest';
import { describeCommand } from '../describe.js';
import { readFile, writeFile } from 'fs/promises';
import { Anthropic } from '@anthropic-ai/sdk';
import { getApiKey } from '../../utils/api-keys.js';
import chalk from 'chalk';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('@anthropic-ai/sdk');
vi.mock('../../utils/api-keys.js');

const mockedReadFile = vi.mocked(readFile);
const mockedWriteFile = vi.mocked(writeFile);
const mockedGetApiKey = vi.mocked(getApiKey);
const mockedAnthropic = vi.mocked(Anthropic);

describe('describe command', () => {
    const TEST_FILE = 'test.ts';
    const TEST_CODE = 'const hello = "world";';
    const TEST_RESPONSE = '# Overview\n- Test overview\n\n# Functions/Classes\n- Test functions\n\n# Behavior Flow\n- Test flow\n\n# Key Points\n- Test points';

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock console methods to prevent output during tests
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Mock fs operations
        mockedReadFile.mockResolvedValue(TEST_CODE);
        mockedWriteFile.mockResolvedValue(undefined);
        
        // Mock Anthropic API key
        mockedGetApiKey.mockResolvedValue('test-api-key');
        
        // Mock Anthropic client
        const mockClient = {
            messages: {
                create: vi.fn().mockResolvedValue({
                    content: [{ text: TEST_RESPONSE }]
                })
            }
        };
        mockedAnthropic.mockImplementation(() => mockClient as any);
    });

    test('successfully generates documentation', async () => {
        // Execute the command
        await describeCommand.parseAsync(['node', 'test', TEST_FILE]);
        
        // Verify file operations
        expect(mockedReadFile).toHaveBeenCalledWith(TEST_FILE, 'utf8');
        expect(mockedWriteFile).toHaveBeenCalledWith(
            expect.stringContaining('test.md'),
            TEST_RESPONSE,
            'utf8'
        );
        
        // Verify API key was retrieved
        expect(mockedGetApiKey).toHaveBeenCalledWith('anthropic');
        
        // Verify Anthropic client was created and used
        expect(mockedAnthropic).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    });

    test('uses custom output path when specified', async () => {
        const customOutput = 'docs/custom.md';
        
        // Execute the command with custom output
        await describeCommand.parseAsync(['node', 'test', TEST_FILE, '-o', customOutput]);
        
        // Verify file was written to custom path
        expect(mockedWriteFile).toHaveBeenCalledWith(
            customOutput,
            TEST_RESPONSE,
            'utf8'
        );
    });

    test('handles missing API key', async () => {
        // Mock missing API key
        mockedGetApiKey.mockResolvedValue(null);
        
        // Execute the command
        const processExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
            expect(code).toBe(1);
            throw new Error('process.exit called');
        });
        
        await expect(describeCommand.parseAsync(['node', 'test', TEST_FILE])).rejects.toThrow('process.exit called');
        
        // Verify error handling
        expect(processExit).toHaveBeenCalledWith(1);
        expect(console.error).toHaveBeenCalledWith(
            chalk.red('Error:'),
            new Error('Anthropic API key not configured. Run "ai config-help anthropic" for setup instructions.')
        );
    });

    test('handles file read errors', async () => {
        // Mock file read error
        mockedReadFile.mockRejectedValue(new Error('File not found'));
        
        // Execute the command
        const processExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
            expect(code).toBe(1);
            throw new Error('process.exit called');
        });
        
        await expect(describeCommand.parseAsync(['node', 'test', TEST_FILE])).rejects.toThrow('process.exit called');
        
        // Verify error handling
        expect(processExit).toHaveBeenCalledWith(1);
        expect(console.error).toHaveBeenCalledWith(
            chalk.red('Error:'),
            expect.any(Error)
        );
    });

    test('handles Anthropic API errors', async () => {
        // Mock Anthropic API error
        const mockClient = {
            messages: {
                create: vi.fn().mockRejectedValue(new Error('API Error'))
            }
        };
        mockedAnthropic.mockImplementation(() => mockClient as any);
        
        // Execute the command
        const processExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
            expect(code).toBe(1);
            throw new Error('process.exit called');
        });
        
        await expect(describeCommand.parseAsync(['node', 'test', TEST_FILE])).rejects.toThrow('process.exit called');
        
        // Verify error handling
        expect(processExit).toHaveBeenCalledWith(1);
        expect(console.error).toHaveBeenCalledWith(
            chalk.red('Error:'),
            expect.any(Error)
        );
    });
}); 