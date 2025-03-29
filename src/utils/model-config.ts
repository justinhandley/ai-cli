import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { CommandModelConfig, ModelConfig, SupportedService } from '../types/index.js';
import { OUTPUT_DIR_NAME } from './constants.js';

const DEFAULT_CONFIG: CommandModelConfig = {
    search: {
        service: 'anthropic',
        model: 'claude-3-haiku-20240307'
    },
    debug: {
        service: 'openai',
        model: 'gpt-4-turbo-preview'
    },
    describe: {
        service: 'anthropic',
        model: 'claude-3-haiku-20240307'
    },
    collect: {
        service: 'google-studio',
        model: 'gemini-pro'
    }
};

const CONFIG_FILE = 'config.json';

export async function getModelConfig(command: keyof CommandModelConfig): Promise<ModelConfig> {
    const config = await loadConfig();
    return config[command];
}

export async function setModelConfig(command: keyof CommandModelConfig, service: SupportedService, model: string): Promise<void> {
    const config = await loadConfig();
    config[command] = { service, model };
    await saveConfig(config);
}

export async function setDefaultService(service: SupportedService): Promise<void> {
    const config = await loadConfig();
    const defaultModel = getDefaultModelForService(service);
    
    // Update all commands to use the default service
    for (const command of Object.keys(config) as Array<keyof CommandModelConfig>) {
        config[command] = { service, model: defaultModel };
    }
    
    await saveConfig(config);
}

function getDefaultModelForService(service: SupportedService): string {
    switch (service) {
        case 'anthropic':
            return 'claude-3-haiku-20240307';
        case 'openai':
            return 'gpt-4-turbo-preview';
        case 'google-studio':
            return 'gemini-pro';
        default:
            throw new Error(`Unsupported service: ${service}`);
    }
}

async function loadConfig(): Promise<CommandModelConfig> {
    try {
        const configPath = path.join(process.cwd(), OUTPUT_DIR_NAME, CONFIG_FILE);
        const configContent = await readFile(configPath, 'utf8');
        return JSON.parse(configContent);
    } catch (error) {
        // If config doesn't exist or is invalid, return default config
        return DEFAULT_CONFIG;
    }
}

async function saveConfig(config: CommandModelConfig): Promise<void> {
    const configDir = path.join(process.cwd(), OUTPUT_DIR_NAME);
    await mkdir(configDir, { recursive: true });
    
    const configPath = path.join(configDir, CONFIG_FILE);
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
} 