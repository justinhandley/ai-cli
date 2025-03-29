import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdir, writeFile, rm, readFile, access } from 'fs/promises';
import path from 'path';
import { createCollectCommand } from '../collect.js';
import { OUTPUT_DIR_NAME } from '../../utils/constants.js';

// Mock the AI service to avoid actual API calls
vi.mock('../../services/ai-service.js', () => ({
    AIService: {
        getInstance: () => ({
            analyzeCode: () => ({ text: 'Test analysis' })
        })
    }
}));

// Mock the model config to return a test service
vi.mock('../../utils/model-config.js', () => ({
    getModelConfig: () => ({ service: 'test-service' })
}));

// Mock the API key to return a test key
vi.mock('../../utils/api-keys.js', () => ({
    getApiKey: () => 'test-key'
}));

const TEST_DIR = path.join(process.cwd(), 'test-fixtures');
const TEST_FILE = path.join(TEST_DIR, 'test.ts');
const TEST_CONTENT = 'console.log("test");';
const OUTPUT_DIR = path.join(process.cwd(), OUTPUT_DIR_NAME);

// Helper function to wait for a file to exist
async function waitForFile(filePath: string, maxAttempts = 10): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            await access(filePath);
            return;
        } catch (error) {
            if (i === maxAttempts - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

describe('collect command', () => {
    beforeEach(async () => {
        // Clean up any existing test files
        await rm(TEST_DIR, { recursive: true, force: true });
        await rm(OUTPUT_DIR, { recursive: true, force: true });
        
        // Create test directory and file
        await mkdir(TEST_DIR, { recursive: true });
        await writeFile(TEST_FILE, TEST_CONTENT, 'utf8');
        
        // Verify the file was created
        const content = await readFile(TEST_FILE, 'utf8');
        expect(content).toBe(TEST_CONTENT);
        
        // Verify the file exists and is accessible
        await access(TEST_FILE);
    });

    afterEach(async () => {
        // Clean up test files
        await rm(TEST_DIR, { recursive: true, force: true });
        await rm(OUTPUT_DIR, { recursive: true, force: true });
    });

    test('collects TypeScript files from directory', async () => {
        const command = createCollectCommand();
        
        // Execute the command with the absolute path
        await command.parseAsync(['node', 'test', TEST_DIR]);
        
        // Wait for the output directory to exist
        await waitForFile(OUTPUT_DIR);
        
        // Get the expected output file name based on the path
        const pathSegments = TEST_DIR.split(path.sep).filter(Boolean);
        const fileName = pathSegments.join('_');
        const outputFile = path.join(OUTPUT_DIR, `${fileName}.txt`);
        
        // Wait for the file to exist
        await waitForFile(outputFile);
        
        const outputContent = await readFile(outputFile, 'utf8');
        
        expect(outputContent).toContain(TEST_CONTENT);
        expect(outputContent).toContain(TEST_FILE);
    });
}); 