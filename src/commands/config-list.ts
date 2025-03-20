import { Command } from 'commander';
import chalk from 'chalk';
import { SUPPORTED_SERVICES } from '../utils/constants.js';
import { getApiKey } from '../utils/api-keys.js';

export const configListCommand = new Command('config-list')
    .description('List configured services')
    .action(async () => {
        for (const service of SUPPORTED_SERVICES) {
            const apiKey = await getApiKey(service);
            if (apiKey) {
                console.log(chalk.green(`✓ ${service}: Configured`));
            } else {
                console.log(chalk.yellow(`✗ ${service}: Not configured`));
            }
        }
    }); 