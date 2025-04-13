import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const OUTPUT_DIR_NAME = '.ai-cli';
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE || '', OUTPUT_DIR_NAME, 'config.json');

export type SupportedService = 'anthropic' | 'github' | 'google-studio' | 'openai';

export interface GitConfig {
    defaultBranch: string;
}

export interface ModelConfig {
    service: SupportedService;
    model: string;
}

interface Config {
    git: GitConfig;
    defaultModel?: {
        [key in SupportedService]?: string;
    };
    search: ModelConfig;
    debug: ModelConfig;
    describe: ModelConfig;
    [command: string]: ModelConfig | GitConfig | { [key in SupportedService]?: string } | undefined;
}

const DEFAULT_CONFIG: Config = {
    git: {
        defaultBranch: 'main'
    },
    search: {
        service: 'anthropic',
        model: 'claude-3-haiku-20240307'
    },
    debug: {
        service: 'anthropic',
        model: 'claude-3-haiku-20240307'
    },
    describe: {
        service: 'anthropic',
        model: 'claude-3-haiku-20240307'
    }
};

function getConfig(): Config {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return DEFAULT_CONFIG;
        }
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) as Config;
        return { ...DEFAULT_CONFIG, ...config };
    } catch (error) {
        console.error('Error reading config:', error);
        return DEFAULT_CONFIG;
    }
}

function saveConfig(config: Config) {
    try {
        const configDir = path.dirname(CONFIG_FILE);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

export function getGitConfig(): GitConfig {
    const config = getConfig();
    return config.git;
}

export function setGitConfig(defaultBranch: string) {
    const config = getConfig();
    config.git = { defaultBranch };
    saveConfig(config);
}

export function getDefaultModelForService(service: SupportedService): string {
    const config = getConfig();
    return config.defaultModel?.[service] || 'claude-3-haiku-20240307';
}

export function setDefaultModelForService(service: SupportedService, model: string) {
    const config = getConfig();
    if (!config.defaultModel) {
        config.defaultModel = {};
    }
    config.defaultModel[service] = model;
    saveConfig(config);
}

export function getModelConfig(command: string): ModelConfig {
    const config = getConfig();
    const commandConfig = config[command] as ModelConfig;
    if (commandConfig && 'service' in commandConfig && 'model' in commandConfig) {
        return commandConfig;
    }
    return DEFAULT_CONFIG[command] as ModelConfig;
}

export function setModelConfig(command: string, service: SupportedService, model: string): void {
    const config = getConfig();
    config[command] = { service, model };
    saveConfig(config);
}

export async function setDefaultService(service: SupportedService): Promise<void> {
    const config = getConfig();
    Object.keys(config).forEach(key => {
        const value = config[key];
        if (value && typeof value === 'object' && 'service' in value) {
            (value as ModelConfig).service = service;
        }
    });
    saveConfig(config);
} 