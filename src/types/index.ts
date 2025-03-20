import { Command } from 'commander';

export interface ApiKeys {
    anthropic?: string;
    github?: string;
    'google-studio'?: string;
    openai?: string;
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