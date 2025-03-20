import { Command } from 'commander';
import chalk from 'chalk';
import { SUPPORTED_SERVICES, SupportedService } from '../utils/constants.js';

const SERVICE_HELP: Record<SupportedService, { description: string; url: string }> = {
    anthropic: {
        description: 'Get your Claude API key from the Anthropic Console.',
        url: 'https://console.anthropic.com/account/keys'
    },
    github: {
        description: 'Create a GitHub Personal Access Token with "repo" scope for searching issues.',
        url: 'https://github.com/settings/tokens'
    },
    'google-studio': {
        description: 'Get your Google Studio API key from the Google Cloud Console.',
        url: 'https://console.cloud.google.com/apis/credentials'
    },
    openai: {
        description: 'Get your OpenAI API key from the OpenAI dashboard.',
        url: 'https://platform.openai.com/api-keys'
    }
} as const;

export const configHelpCommand = new Command('config-help')
    .description('Get help with configuring API keys')
    .argument('[service]', `Service to get help with (${SUPPORTED_SERVICES.join(', ')})`)
    .action(async (service?: string) => {
        try {
            if (!service) {
                console.log(chalk.blue('\nAPI Key Configuration Help\n'));
                SUPPORTED_SERVICES.forEach(svc => {
                    const help = SERVICE_HELP[svc];
                    console.log(chalk.green(`\n${svc}:`));
                    console.log(help.description);
                    console.log(chalk.dim(`URL: ${help.url}`));
                });
                return;
            }

            if (!SUPPORTED_SERVICES.includes(service as SupportedService)) {
                console.error(chalk.red(`Invalid service. Supported services: ${SUPPORTED_SERVICES.join(', ')}`));
                process.exit(1);
            }

            const help = SERVICE_HELP[service as SupportedService];
            console.log(chalk.blue(`\nConfiguration Help for ${service}\n`));
            console.log(help.description);
            console.log(chalk.dim(`\nURL: ${help.url}`));
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    }); 