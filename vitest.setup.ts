import { vi } from 'vitest';

vi.mock('execa', () => ({
  execa: vi.fn().mockImplementation(() => ({
    stdout: 'mocked stdout',
    stderr: '',
    exitCode: 0
  })),
  $: vi.fn().mockImplementation(() => ({
    stdout: 'mocked stdout',
    stderr: '',
    exitCode: 0
  }))
})); 