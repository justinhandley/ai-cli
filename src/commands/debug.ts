import { Command } from 'commander';
import chalk from 'chalk';
import { getApiKey } from '../utils/api-keys.js';
import { getModelConfig } from '../utils/model-config.js';
import { AIService } from '../services/ai-service.js';
import * as constants from '../utils/constants.js';
import { createInterface } from 'readline';

const reasoningPrompt = `
You are a senior software engineer who excels at diagnosing and reasoning about complex errors.
Given the following errors and code snippet, provide:
1. A reasoning-based analysis of what is likely going wrong.
2. Step-by-step debugging strategies.
3. Suggested code changes if applicable.

Be thoughtful, step-by-step, and do not rush to a fix.
`;

export async function readInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(prompt, (answer: string) => {
            rl.close();
            resolve(answer);
        });
    });
}

export async function readMultiLineInput(): Promise<string> {
    return new Promise<string>((resolve) => {
        const lines: string[] = [];
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (line) => {
            lines.push(line);
        });

        rl.on('close', () => {
            resolve(lines.join('\n'));
        });
    });
}

async function runDebug(errors: string, code: string): Promise<void> {
    const modelConfig = await getModelConfig('debug');
    const apiKey = await getApiKey(modelConfig.service);
    
    if (!apiKey) {
        console.log(chalk.red(`Error: ${modelConfig.service} API key not configured`));
        return;
    }

    try {
        console.log(chalk.blue("\nAnalyzing your input..."));
        const aiService = AIService.getInstance();
        const response = await aiService.analyzeError(errors, code, modelConfig, apiKey);
        
        console.log(chalk.green("\n=== Debug Analysis ===\n"));
        console.log(response.text);
    } catch (error) {
        console.log(chalk.red(`Error getting AI response: ${error instanceof Error ? error.message : String(error)}`));
    }
}

export function createDebugCommand(): Command {
    const command = new Command('debug')
        .description('Analyze errors and code snippets with AI assistance')
        .action(async () => {
            console.log(chalk.blue("Paste errors (press Enter after each line, then CTRL+D when finished):"));
            
            // Read errors (multi-line)
            const errors = await readMultiLineInput();
            
            if (!errors.trim()) {
                console.log(chalk.yellow("No errors provided. Exiting..."));
                return;
            }

            console.log(chalk.blue("\nErrors received. Now, paste code snippet (or just press enter to skip):"));
            const code = await readInput("");
            
            await runDebug(errors, code);
        });

    return command;
} 