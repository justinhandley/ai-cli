import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import { OpenAI } from 'openai';
import { getApiKey } from '../../utils/api-keys.js';
import { Command } from 'commander';

vi.mock('openai');
vi.mock('../../utils/api-keys.js');

// Mock console.log
const mockConsoleLog = vi.fn();
vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);

// Mock the debug module
vi.mock('../debug.js', () => {
    const mockReadMultiLineInput = vi.fn().mockResolvedValue('Test error');
    const mockReadInput = vi.fn().mockResolvedValue('');
    
    return {
        readMultiLineInput: mockReadMultiLineInput,
        readInput: mockReadInput,
        createDebugCommand: () => {
            const command = new Command('debug')
                .description('Analyze errors and code snippets with AI assistance')
                .action(async () => {
                    console.log("Paste errors (press Enter after each line, then CTRL+D when finished):");
                    
                    // Read errors (multi-line)
                    const errors = await mockReadMultiLineInput();
                    
                    if (!errors.trim()) {
                        console.log("No errors provided. Exiting...");
                        return;
                    }

                    console.log("\nErrors received. Now, paste code snippet (or just press enter to skip):");
                    const code = await mockReadInput("");
                    
                    await runDebug(errors, code);
                });

            return command;
        }
    };
});

// Import after mocking
import { createDebugCommand } from '../debug.js';

async function runDebug(errors: string, code: string): Promise<void> {
    const openaiKey = await getApiKey('openai');
    if (!openaiKey) {
        console.log('Error: OpenAI API key not configured');
        return;
    }

    const client = new OpenAI({
        apiKey: openaiKey
    });

    const reasoningPrompt = `
You are a senior software engineer who excels at diagnosing and reasoning about complex errors.
Given the following errors and code snippet, provide:
1. A reasoning-based analysis of what is likely going wrong.
2. Step-by-step debugging strategies.
3. Suggested code changes if applicable.

Be thoughtful, step-by-step, and do not rush to a fix.
`;

    const fullPrompt = `${reasoningPrompt}\n\n---\nErrors:\n${errors}\n\nCode:\n${code}\n---`;

    try {
        console.log("\nAnalyzing your input...");
        const response = await client.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: reasoningPrompt },
                { role: "user", content: fullPrompt }
            ]
        });

        console.log("\n=== Debug Analysis ===\n");
        console.log(response.choices[0]?.message?.content ?? 'No response from the model.');
    } catch (error) {
        console.log(`Error getting AI response: ${error instanceof Error ? error.message : String(error)}`);
    }
}

describe('debug command', () => {
    let command: Command;
    let mockOpenAI: any;

    beforeEach(() => {
        command = createDebugCommand();
        mockOpenAI = {
            chat: {
                completions: {
                    create: vi.fn()
                }
            }
        };
        (OpenAI as any).mockImplementation(() => mockOpenAI);
        mockConsoleLog.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('should handle missing OpenAI API key', async () => {
        vi.mocked(getApiKey).mockResolvedValue(null);

        await command.parseAsync(['debug']);

        expect(getApiKey).toHaveBeenCalledWith('openai');
        expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith('Error: OpenAI API key not configured');
    });

    test('should process errors and code successfully', async () => {
        const mockApiKey = 'test-api-key';
        const mockResponse = {
            choices: [{
                message: {
                    content: 'Test analysis'
                }
            }]
        };

        vi.mocked(getApiKey).mockResolvedValue(mockApiKey);
        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        await command.parseAsync(['debug']);

        expect(getApiKey).toHaveBeenCalledWith('openai');
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'gpt-4-turbo-preview',
                messages: expect.arrayContaining([
                    expect.objectContaining({
                        role: 'system',
                        content: expect.stringContaining('You are a senior software engineer')
                    }),
                    expect.objectContaining({
                        role: 'user',
                        content: expect.stringContaining('Test error')
                    })
                ])
            })
        );
        expect(mockConsoleLog).toHaveBeenCalledWith('Test analysis');
    });

    test('should handle OpenAI API errors gracefully', async () => {
        const mockApiKey = 'test-api-key';
        const mockError = new Error('API Error');

        vi.mocked(getApiKey).mockResolvedValue(mockApiKey);
        mockOpenAI.chat.completions.create.mockRejectedValue(mockError);

        await command.parseAsync(['debug']);

        expect(getApiKey).toHaveBeenCalledWith('openai');
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith('Error getting AI response: API Error');
    });

    test('should handle empty error input', async () => {
        const mockApiKey = 'test-api-key';

        vi.mocked(getApiKey).mockResolvedValue(mockApiKey);
        
        // Override the readMultiLineInput mock for this test
        const { readMultiLineInput } = await import('../debug.js');
        vi.mocked(readMultiLineInput).mockResolvedValue('');

        await command.parseAsync(['debug']);

        expect(getApiKey).not.toHaveBeenCalled();
        expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith('No errors provided. Exiting...');
    });
}); 