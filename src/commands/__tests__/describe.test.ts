import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import { createDescribeCommand } from '../describe.js';
import { getApiKey } from '../../utils/api-keys.js';
import { getModelConfig } from '../../utils/model-config.js';
import { AIService } from '../../services/ai-service.js';

vi.mock('../../utils/api-keys.js');
vi.mock('../../utils/model-config.js');
vi.mock('../../services/ai-service.js');

const TEST_DIR = path.join(process.cwd(), 'test-fixtures');
const TEST_FILE = path.join(TEST_DIR, 'test.ts');
const TEST_CODE = 'console.log("test");';

describe('describe command', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        // Create test directory and file
        await mkdir(TEST_DIR, { recursive: true });
        await writeFile(TEST_FILE, TEST_CODE, 'utf8');

        // Mock default configuration
        vi.mocked(getModelConfig).mockResolvedValue({
            service: 'anthropic',
            model: 'claude-3-sonnet-20240307'
        });

        // Mock AIService
        vi.mocked(AIService.getInstance).mockReturnValue({
            analyzeCode: vi.fn().mockResolvedValue({ text: 'Test analysis' })
        } as any);
    });

    afterEach(async () => {
        // Clean up test files
        await rm(TEST_DIR, { recursive: true, force: true });
    });

    test('successfully generates documentation', async () => {
        // Mock API key
        vi.mocked(getApiKey).mockResolvedValue('test-key');

        const command = createDescribeCommand();
        // Execute the command
        await command.parseAsync(['node', 'test', TEST_FILE]);
        
        // Verify AIService was called
        const aiService = AIService.getInstance();
        expect(aiService.analyzeCode).toHaveBeenCalledWith(
            TEST_CODE,
            expect.any(Object),
            'test-key'
        );
    });

    test('uses custom output path when specified', async () => {
        // Mock API key
        vi.mocked(getApiKey).mockResolvedValue('test-key');

        const customOutput = path.join(TEST_DIR, 'custom-output.md');
        const command = createDescribeCommand();
        
        // Execute the command with custom output
        await command.parseAsync(['node', 'test', TEST_FILE, '-o', customOutput]);
        
        // Verify AIService was called
        const aiService = AIService.getInstance();
        expect(aiService.analyzeCode).toHaveBeenCalled();
    });

    test('handles missing API key', async () => {
        // Mock missing API key
        vi.mocked(getApiKey).mockResolvedValue(null);
        
        const command = createDescribeCommand();
        await expect(command.parseAsync(['node', 'test', TEST_FILE]))
            .rejects.toThrow();
    });

    test('handles file read errors', async () => {
        // Remove test file to cause read error
        await rm(TEST_FILE);
        
        const command = createDescribeCommand();
        await expect(command.parseAsync(['node', 'test', TEST_FILE]))
            .rejects.toThrow();
    });

    test('handles Anthropic API errors', async () => {
        // Mock API key
        vi.mocked(getApiKey).mockResolvedValue('test-key');
        
        // Mock AIService error
        vi.mocked(AIService.getInstance).mockReturnValue({
            analyzeCode: vi.fn().mockRejectedValue(new Error('API Error'))
        } as any);
        
        const command = createDescribeCommand();
        await expect(command.parseAsync(['node', 'test', TEST_FILE]))
            .rejects.toThrow();
    });
}); 