import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
    getCollectionConfigs, 
    getCollectionConfig, 
    setCollectionConfig, 
    deleteCollectionConfig,
    getDefaultCollectionConfig
} from '../utils/model-config.js';
import { CollectionConfig } from '../types/index.js';

export function createConfigCollectCommand(): Command {
    const command = new Command('config-collect')
        .description('Configure file collection settings');

    // List all configurations
    command
        .command('list')
        .description('List all collection configurations')
        .action(() => {
            const configs = getCollectionConfigs();
            console.log(chalk.blue('\nCollection Configurations:\n'));
            
            Object.values(configs).forEach(config => {
                console.log(chalk.green(`${config.name}${config.isDefault ? ' (default)' : ''}:`));
                console.log(chalk.gray(`  Extensions: ${config.extensions.join(', ')}`));
                console.log(chalk.gray(`  Ignore Patterns: ${config.ignorePatterns.join(', ')}\n`));
            });
        });

    // Create new configuration
    command
        .command('create')
        .description('Create a new collection configuration')
        .action(async () => {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Configuration name:',
                    validate: (input) => input.length > 0
                },
                {
                    type: 'input',
                    name: 'extensions',
                    message: 'File extensions (comma-separated):',
                    default: '.ts,.tsx',
                    validate: (input) => input.length > 0
                },
                {
                    type: 'input',
                    name: 'ignorePatterns',
                    message: 'Ignore patterns (comma-separated):',
                    default: '**/node_modules/**,**/dist/**,**/*.test.ts,**/*.config.ts,**/*.spec.ts'
                },
                {
                    type: 'confirm',
                    name: 'isDefault',
                    message: 'Set as default configuration?',
                    default: false
                }
            ]);

            const config: CollectionConfig = {
                name: answers.name,
                extensions: answers.extensions.split(',').map((ext: string) => ext.trim()),
                ignorePatterns: answers.ignorePatterns.split(',').map((pattern: string) => pattern.trim()),
                isDefault: answers.isDefault
            };

            setCollectionConfig(config);
            console.log(chalk.green(`\nCreated configuration: ${config.name}`));
        });

    // Edit existing configuration
    command
        .command('edit <name>')
        .description('Edit an existing collection configuration')
        .action(async (name: string) => {
            const config = getCollectionConfig(name.toLowerCase());
            if (!config) {
                console.error(chalk.red(`Configuration "${name}" not found`));
                return;
            }

            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'extensions',
                    message: 'File extensions (comma-separated):',
                    default: config.extensions.join(',')
                },
                {
                    type: 'input',
                    name: 'ignorePatterns',
                    message: 'Ignore patterns (comma-separated):',
                    default: config.ignorePatterns.join(',')
                },
                {
                    type: 'confirm',
                    name: 'isDefault',
                    message: 'Set as default configuration?',
                    default: config.isDefault
                }
            ]);

            const updatedConfig: CollectionConfig = {
                ...config,
                extensions: answers.extensions.split(',').map((ext: string) => ext.trim()),
                ignorePatterns: answers.ignorePatterns.split(',').map((pattern: string) => pattern.trim()),
                isDefault: answers.isDefault
            };

            setCollectionConfig(updatedConfig);
            console.log(chalk.green(`\nUpdated configuration: ${config.name}`));
        });

    // Delete configuration
    command
        .command('delete <name>')
        .description('Delete a collection configuration')
        .action((name: string) => {
            const config = getCollectionConfig(name.toLowerCase());
            if (!config) {
                console.error(chalk.red(`Configuration "${name}" not found`));
                return;
            }

            if (config.isDefault) {
                console.error(chalk.red('Cannot delete the default configuration'));
                return;
            }

            deleteCollectionConfig(name.toLowerCase());
            console.log(chalk.green(`\nDeleted configuration: ${name}`));
        });

    // Set default configuration
    command
        .command('set-default <name>')
        .description('Set a configuration as the default')
        .action((name: string) => {
            const config = getCollectionConfig(name.toLowerCase());
            if (!config) {
                console.error(chalk.red(`Configuration "${name}" not found`));
                return;
            }

            const updatedConfig: CollectionConfig = {
                ...config,
                isDefault: true
            };

            setCollectionConfig(updatedConfig);
            console.log(chalk.green(`\nSet ${name} as default configuration`));
        });

    return command;
} 