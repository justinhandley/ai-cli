import { Command } from 'commander';
import chalk from 'chalk';
import { SUPPORTED_SERVICES, SupportedService } from '../utils/constants.js';
import { setApiKey } from '../utils/api-keys.js';

export const configCommand = new Command('config')
    .description('Configure API keys')
    .argument('<service>', `Service to configure (${SUPPORTED_SERVICES.join(', ')})`)
    .argument('<apiKey>', 'API key to store')
    .action(async (service: string, apiKey: string) => {
        if (!SUPPORTED_SERVICES.includes(service as SupportedService)) {
            console.error(chalk.red(`Invalid service. Supported services: ${SUPPORTED_SERVICES.join(', ')}`));
            process.exit(1);
        }
        await setApiKey(service as SupportedService, apiKey);
    }); 