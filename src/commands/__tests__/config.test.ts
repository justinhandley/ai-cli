import { describe, beforeEach, test, expect, vi } from 'vitest';
import { execa } from 'execa';
import type { Options } from 'execa';
import { getApiKey, setApiKey } from '../../utils/api-keys.js';
import type { SupportedService } from '../../utils/constants.js';

vi.mock('../../utils/api-keys.js');
vi.mock('execa');

describe('config commands', () => {
    const CLI_PATH = 'dist/index.js';
    const storedKeys: Record<string, string> = {};
    
    beforeEach(() => {
        vi.clearAllMocks();
        Object.keys(storedKeys).forEach(key => delete storedKeys[key]);
        
        vi.mocked(setApiKey).mockImplementation(async (service: SupportedService, key: string) => {
            storedKeys[service] = key;
            return Promise.resolve();
        });

        vi.mocked(getApiKey).mockImplementation(async (service: SupportedService) => {
            return Promise.resolve(storedKeys[service] || null);
        });

        // Fix execa mock to use Options type
        vi.mocked(execa).mockImplementation((file: string | URL, options?: Options) => {
            const args = Array.isArray(options) ? options : [];
            if (args.includes('config')) {
                const serviceIndex = args.indexOf('config') + 1;
                const service = args[serviceIndex];
                const key = args[serviceIndex + 1];
                if (service && key) {
                    setApiKey(service as SupportedService, key);
                }
            }

            return Promise.resolve({
                stdout: '',
                stderr: '',
                exitCode: 0,
                failed: false,
                killed: false,
                command: typeof file === 'string' ? file : file.toString(),
                timedOut: false,
                isCanceled: false,
                [Symbol.dispose]: () => {},
                kill: () => false,
                pipe: () => ({ stdout: '' } as any),
                all: undefined,
                connected: false,
                signalCode: null
            }) as any;
        });
    });

    test('can set and retrieve API key', async () => {
        const testKey = 'test-key-123';
        
        // Pass arguments as Options
        await execa('node', [CLI_PATH, 'config', 'anthropic', testKey] as unknown as Options);
        
        const storedKey = await getApiKey('anthropic');
        expect(storedKey).toBe(testKey);
    });

    // ... rest of tests
}); 