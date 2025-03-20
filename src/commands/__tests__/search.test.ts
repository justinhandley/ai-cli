import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import { getApiKey } from '../../utils/api-keys.js';
import { searchCommand } from '../search.js';
import fs from 'fs/promises';
import path from 'path';
import { Dirent } from 'fs';

vi.mock('axios');
vi.mock('../../utils/api-keys.js');
vi.mock('fs/promises');

// Mock the constants module
vi.mock('../../utils/constants.js', () => ({
    SERVICE_NAME: 'my-ai-cli',
    SUPPORTED_SERVICES: ['anthropic', 'github', 'google-studio', 'openai'],
    OUTPUT_DIR_NAME: '.ai-cli',
    default: {  // Add this in case it's being imported as a default
        SERVICE_NAME: 'my-ai-cli',
        SUPPORTED_SERVICES: ['anthropic', 'github', 'google-studio', 'openai'],
        OUTPUT_DIR_NAME: '.ai-cli'
    }
}));

const mockedAxios = {
    get: vi.fn()
} as unknown as typeof axios;
vi.mocked(axios.get).mockImplementation(() => Promise.resolve({ data: { items: [] } }));

const mockedGetApiKey = vi.mocked(getApiKey);

describe('search command', () => {
    const outputDir = path.join(process.cwd(), '.ai-cli');

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock fs operations
        vi.mocked(fs.mkdir).mockResolvedValue(undefined);
        vi.mocked(fs.writeFile).mockResolvedValue(undefined);
        vi.mocked(fs.readdir).mockResolvedValue([
            { name: 'code_search_test.md', isFile: () => true } as Dirent
        ]);
        vi.mocked(fs.rm).mockResolvedValue(undefined);
        
        // Mock axios get with proper type
        vi.mocked(axios.get).mockResolvedValue({
            data: { items: [] },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        } as AxiosResponse);

        // Default API key mock
        mockedGetApiKey.mockResolvedValue('mock-key');
    });

    afterEach(async () => {
        // Clean up any generated files
        try {
            // Remove the entire .ai-cli directory and its contents
            await fs.rm(outputDir, { recursive: true, force: true });
        } catch (error) {
            console.error('Error cleaning up test files:', error);
        }
    });

    test('searches and generates analysis for a query', async () => {
        // Mock GitHub API response
        vi.mocked(axios.get).mockResolvedValueOnce({
            data: {
                items: [{
                    title: 'Test GitHub Issue',
                    html_url: 'https://github.com/test/issue/1',
                    body: 'Test issue content'
                }]
            }
        });

        // Mock Stack Overflow API response
        vi.mocked(axios.get).mockResolvedValueOnce({
            data: {
                items: [{
                    title: 'Test Stack Overflow Question',
                    question_id: 12345,
                    link: 'https://stackoverflow.com/q/12345'
                }]
            }
        });

        await searchCommand.parseAsync(['node', 'test', 'test error message']);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('api.github.com/search/issues'),
            expect.any(Object)
        );
    });

    test('handles missing API keys gracefully', async () => {
        // Mock console.log to capture output
        const consoleSpy = vi.spyOn(console, 'log');
        mockedGetApiKey.mockResolvedValue(null);

        await searchCommand.parseAsync(['node', 'test', 'test error']);

        // Verify error message was logged
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error: Anthropic API key not configured')
        );
    });

    test('handles API errors gracefully', async () => {
        vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

        await searchCommand.parseAsync(['node', 'test', 'test error']);

        expect(axios.get).toHaveBeenCalled();
    });

    test('respects search limits from options', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: { items: [] }
        });

        await searchCommand.parseAsync([
            'node',
            'test',
            'test error',
            '--github-limit',
            '2',
            '--stackoverflow-limit',
            '1'
        ]);

        // Verify GitHub API call used correct limit
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('per_page=2'),
            expect.any(Object)
        );

        // Verify Stack Overflow API call used correct limit
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('stackexchange.com'),
            expect.objectContaining({
                params: expect.objectContaining({
                    pagesize: 1
                })
            })
        );
    });
}); 