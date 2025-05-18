import { Command } from 'commander';

export interface ApiKeys {
    anthropic?: string;
    github?: string;
    'google-studio'?: string;
    openai?: string;
}

export type SupportedService = 'anthropic' | 'github' | 'google-studio' | 'openai';

export interface ModelConfig {
    service: SupportedService;
    model: string;
}

export interface GitConfig {
    defaultBranch: string;
}

export interface CommandModelConfig {
    search: ModelConfig;
    debug: ModelConfig;
    describe: ModelConfig;
    collect: ModelConfig;
    git?: GitConfig;
}

export interface SearchResult {
    title: string;
    url: string;
    platform: string;
}

export interface SearchOptions {
    githubLimit: number;
    stackoverflowLimit: number;
}

export interface CollectionConfig {
    name: string;
    extensions: string[];
    ignorePatterns: string[];
    isDefault?: boolean;
}

export interface CollectionConfigs {
    [key: string]: CollectionConfig;
} 