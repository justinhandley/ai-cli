import { Command } from 'commander';
import chalk from 'chalk';
import { getApiKey } from '../utils/api-keys.js';
import { getModelConfig } from '../utils/model-config.js';
import { AIService } from '../services/ai-service.js';
import * as constants from '../utils/constants.js';
import { readFile, writeFile } from 'fs/promises';
import path from 'node:path';

async function runDescribe(filePath: string, outputPath?: string): Promise<void> {
    const modelConfig = await getModelConfig('describe');
    const apiKey = await getApiKey(modelConfig.service);
    
    if (!apiKey) {
        throw new Error(`${modelConfig.service} API key not configured`);
    }

    try {
        const fileContent = await readFile(filePath, 'utf-8');
        console.log(chalk.blue("\nAnalyzing your code..."));
        
        const aiService = AIService.getInstance();
        const response = await aiService.analyzeCode(fileContent, modelConfig, apiKey);
        
        if (outputPath) {
            await writeFile(outputPath, response.text);
            console.log(chalk.green(`\nDocumentation saved to: ${outputPath}`));
        } else {
            // Create markdown file next to the source file
            const sourceDir = path.dirname(filePath);
            const sourceFileName = path.basename(filePath, path.extname(filePath));
            const markdownPath = path.join(sourceDir, `${sourceFileName}.md`);
            
            await writeFile(markdownPath, response.text);
            console.log(chalk.green(`\nDocumentation saved to: ${markdownPath}`));
        }
        
        // Always show the documentation in the console as well
        console.log(chalk.green("\n=== Code Documentation ===\n"));
        console.log(response.text);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Error analyzing code: ${errorMessage}`);
    }
}

export function createDescribeCommand(): Command {
    const command = new Command('describe')
        .description('Generate English documentation from code files')
        .argument('<file>', 'Path to the code file to analyze')
        .option('-o, --output <path>', 'Output path for the documentation')
        .action(async (filePath: string, options: { output?: string }) => {
            await runDescribe(filePath, options.output);
        });

    return command;
} 