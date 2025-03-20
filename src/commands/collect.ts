import { Command } from 'commander';
import chalk from 'chalk';
import { globby } from 'globby';
import untildify from 'untildify';
import { readFile, appendFile, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import open from 'open';
import { OUTPUT_DIR_NAME } from '../utils/constants.js';
import { getApiKey } from '../utils/api-keys.js';

export const collectCommand = new Command('collect')
    .description('Collect and concatenate TypeScript files for AI processing')
    .argument('[path]', 'directory to search', '.')
    .action(async (rawPath: string) => {
        try {
            const expandedPath = untildify(rawPath);

            const globPattern = path.resolve(expandedPath, '**', '*.ts{,x,__tmpl__}');
            const files = await globby(globPattern, {
                onlyFiles: true,
                ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.ts', '**/*.config.ts', '**/*.spec.ts'],
            });

            const pathSegments = rawPath.split(path.sep).filter(Boolean);
            const fileName = pathSegments.join('_') || 'current';

            // Create .ai-cli directory if it doesn't exist
            const outputDir = path.join(process.cwd(), OUTPUT_DIR_NAME);
            await mkdir(outputDir, { recursive: true });

            const outputFile = path.join(outputDir, `${fileName}.txt`);

            try {
                await unlink(outputFile);
            } catch (e) {
                // Ignore error if file doesn't exist
            }

            console.log(chalk.blue(`Processing ${files.length} TypeScript files...`));

            for (const file of files) {
                const contents = await readFile(file, 'utf8');
                await appendFile(outputFile, `// ${file}\n`);
                await appendFile(outputFile, contents + '\n\n');
            }

            console.log(chalk.green(`Files collected and saved to: ${outputFile}`));

            // Check if Google AI Studio API key is configured
            const googleStudioKey = await getApiKey('google-studio');
            if (googleStudioKey) {
                console.log(chalk.yellow('\nTo use Google AI Studio:'));
                console.log(chalk.gray('1. Go to https://aistudio.google.com/app/prompts/new_chat'));
                console.log(chalk.gray(`2. Upload the file ${fileName}.txt in the .ai-cli folder of this project (full URL above)`));
            } else {
                // If no Google Studio key, just open the directory
                await open(path.dirname(outputFile));
                console.log(chalk.yellow('Google AI Studio integration not configured. Run "ai config-help google-studio" for setup instructions.'));
            }
        } catch (error) {
            console.error(chalk.red('Error collecting files:'), error);
            process.exit(1);
        }
    });
