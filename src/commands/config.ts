import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { SUPPORTED_SERVICES, SupportedService } from '../utils/constants.js';
import { setApiKey, getConfiguredServices } from '../utils/api-keys.js';
import { setDefaultService } from '../utils/model-config.js';

export const configCommand = new Command('config')
    .description('Configure API keys')
    .argument('<service>', `Service to configure (${SUPPORTED_SERVICES.join(', ')})`)
    .argument('<apiKey>', 'API key to store')
    .action(async (service: string, apiKey: string) => {
        if (!SUPPORTED_SERVICES.includes(service as SupportedService)) {
            console.error(chalk.red(`Invalid service. Supported services: ${SUPPORTED_SERVICES.join(', ')}`));
            process.exit(1);
        }

        try {
            // Set the API key
            await setApiKey(service as SupportedService, apiKey);
            console.log(chalk.green(`API key configured for ${service}`));

            // Get all configured services
            const configuredServices = await getConfiguredServices();
            
            // If this is the first service, make it the default
            if (configuredServices.length === 1) {
                console.log(chalk.blue(`\nThis is your first configured service. Making ${service} the default for all commands.`));
                await setDefaultService(service as SupportedService);
            } 
            // If this is a new service, ask if they want to make it the default
            else if (!configuredServices.includes(service as SupportedService)) {
                const { makeDefault } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'makeDefault',
                        message: `Would you like to make ${service} the default service for all commands?`,
                        default: false
                    }
                ]);

                if (makeDefault) {
                    await setDefaultService(service as SupportedService);
                    console.log(chalk.green(`\n${service} is now the default service for all commands.`));
                }
            }
        } catch (error) {
            console.error(chalk.red('Error configuring service:'), error);
            process.exit(1);
        }
    }); 