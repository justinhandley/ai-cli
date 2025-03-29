import { Command } from 'commander';
import chalk from 'chalk';
import { getModelConfig, setModelConfig } from '../utils/model-config.js';
import { SUPPORTED_SERVICES, SupportedService } from '../utils/constants.js';
import { CommandModelConfig } from '../types/index.js';

const VALID_COMMANDS = ['search', 'debug', 'describe', 'collect'] as const;

const AVAILABLE_MODELS: Record<string, string[]> = {
    anthropic: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
    openai: ['gpt-4-turbo-preview', 'gpt-3.5-turbo'],
    'google-studio': ['gemini-pro', 'gemini-pro-vision']
};

export function createConfigModelCommand(): Command {
    const command = new Command('config-model')
        .description('Configure which AI model to use for each command')
        .argument('<command>', 'Command to configure (search, debug, describe, collect)')
        .argument('<service>', `Service to use (${SUPPORTED_SERVICES.join(', ')})`)
        .argument('<model>', 'Model to use (e.g. claude-3-sonnet-20240229, gpt-4-turbo-preview)')
        .action(async (cmd: string, service: string, model: string) => {
            try {
                if (!SUPPORTED_SERVICES.includes(service as SupportedService)) {
                    throw new Error(`Invalid service. Supported services: ${SUPPORTED_SERVICES.join(', ')}`);
                }

                if (!VALID_COMMANDS.includes(cmd as typeof VALID_COMMANDS[number])) {
                    throw new Error(`Invalid command. Supported commands: ${VALID_COMMANDS.join(', ')}`);
                }

                await setModelConfig(cmd as keyof CommandModelConfig, service as SupportedService, model);
                console.log(chalk.green(`Configured ${cmd} to use ${service} with model ${model}`));
            } catch (error) {
                console.error(chalk.red('Error configuring model:'), error);
                process.exit(1);
            }
        });

    // Add a subcommand to list current configuration
    command
        .command('list')
        .description('List current model configuration')
        .action(async () => {
            try {
                console.log(chalk.blue('\nCurrent Model Configuration:\n'));
                
                for (const cmd of VALID_COMMANDS) {
                    const config = await getModelConfig(cmd);
                    console.log(chalk.green(`${cmd}:`));
                    console.log(chalk.gray(`  Service: ${config.service}`));
                    console.log(chalk.gray(`  Model: ${config.model}\n`));
                }
            } catch (error) {
                console.error(chalk.red('Error listing configuration:'), error);
                process.exit(1);
            }
        });

    return command;
} 