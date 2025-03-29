import { Command } from 'commander';
import chalk from 'chalk';
import { globby } from 'globby';
import untildify from 'untildify';
import { readFile, appendFile, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { OUTPUT_DIR_NAME } from '../utils/constants.js';
import { getApiKey } from '../utils/api-keys.js';
import { getModelConfig } from '../utils/model-config.js';
import { AIService } from '../services/ai-service.js';

async function runCollect(rawPath: string): Promise<void> {
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

        // Check if any AI service is configured
        const modelConfig = await getModelConfig('collect');
        const apiKey = await getApiKey(modelConfig.service);
        
        if (apiKey) {
            console.log(chalk.blue('\nAnalyzing collected code...'));
            const aiService = AIService.getInstance();
            const fileContent = await readFile(outputFile, 'utf-8');
            const response = await aiService.analyzeCode(fileContent, modelConfig, apiKey);
            
            const analysisFile = path.join(outputDir, `${fileName}_analysis.md`);
            await appendFile(analysisFile, response.text);
            console.log(chalk.green(`Analysis saved to: ${analysisFile}`));
        } else {
            console.log(chalk.yellow('\nNo AI service configured for analysis.'));
            console.log(chalk.gray('To configure an AI service, run:'));
            console.log(chalk.blue('  ai config-model collect <service> <model>'));
            console.log(chalk.blue('  ai config <service> <api-key>'));
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Error collecting files: ${errorMessage}`);
    }
}

export function createCollectCommand(): Command {
    const command = new Command('collect')
        .description('Collect and concatenate TypeScript files for AI processing')
        .argument('[path]', 'directory to search', '.')
        .action(async (rawPath: string) => {
            await runCollect(rawPath);
        });

    return command;
}
