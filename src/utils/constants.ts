import path from 'path';

// Remove these debug logs
// console.log('Loading constants module...');
// console.log('Exports:', { SERVICE_NAME, SUPPORTED_SERVICES, OUTPUT_DIR_NAME });

// Export as const to ensure type safety
export const SERVICE_NAME = 'my-ai-cli';
export const SUPPORTED_SERVICES = ['anthropic', 'github', 'google-studio', 'openai'] as const;
export const OUTPUT_DIR_NAME = '.ai-cli' as const;

export type SupportedService = typeof SUPPORTED_SERVICES[number];

// Remove the default export since we're using named exports 