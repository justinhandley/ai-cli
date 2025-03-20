import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { collectCommand } from '../collect.js';
import { globby } from 'globby';
import { getApiKey } from '../../utils/api-keys.js';

vi.mock('fs/promises');
vi.mock('globby');
vi.mock('../../utils/api-keys.js', () => ({
    getApiKey: vi.fn()
}));

describe('collect command', () => {
    const TEST_DIR = 'test-fixtures';
    
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock globby to return some TypeScript files
        vi.mocked(globby).mockResolvedValue([
            path.join(TEST_DIR, 'test.ts'),
            path.join(TEST_DIR, 'another.ts')
        ]);
        
        // Mock fs operations that are actually used
        vi.mocked(fs.readFile).mockResolvedValue('const hello: string = "world";');
        vi.mocked(fs.appendFile).mockResolvedValue(undefined);
        vi.mocked(fs.unlink).mockResolvedValue(undefined);

        // Mock getApiKey to return null (no key configured)
        vi.mocked(getApiKey).mockResolvedValue(null);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('collects TypeScript files from directory', async () => {
        // Call the command's action directly
        await collectCommand.parseAsync(['node', 'test', TEST_DIR]);
        
        // Verify the operations that should actually happen
        expect(globby).toHaveBeenCalledWith(
            expect.stringContaining('*.ts'),
            expect.objectContaining({
                onlyFiles: true,
                ignore: expect.arrayContaining(['**/node_modules/**'])
            })
        );
        
        expect(fs.readFile).toHaveBeenCalled();
        expect(fs.appendFile).toHaveBeenCalled();
    });
}); 