import { Command } from 'commander';
import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Anthropic } from '@anthropic-ai/sdk';
import { getApiKey } from '../utils/api-keys.js';

const EXPLANATION_PROMPT = `You are an AI specialized in analyzing source code and producing structured, plain-English representations of its functionality.

Your Task:
1. Read and interpret the code I provide.
2. Produce a technical, English-only summary of what the code does.
3. Use headings (e.g. # Overview, # Functions, # Classes, # Behavior Flow) and bullet points.
4. Do not include any code in your final output—only explain how the code behaves.
5. Keep it concise but thorough, focusing on purpose, process, and relationships between functions or modules.

Format the output as a markdown file with the following structure:
# Overview
- High-level description of what the code does

# Functions/Classes
- Description of each function/class and its purpose
- Parameters and return values
- Key behaviors and side effects

# Behavior Flow
- Step-by-step explanation of how the code executes
- Important state changes and data flow

# Key Points
- Notable implementation details
- Important considerations or dependencies

Please analyze the following code and provide a detailed explanation:`;

async function generateExplanation(code: string): Promise<string> {
    const apiKey = await getApiKey('anthropic');
    if (!apiKey) {
        throw new Error('Anthropic API key not configured. Run "ai config-help anthropic" for setup instructions.');
    }

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [{
            role: 'user',
            content: EXPLANATION_PROMPT + '\n\n' + code
        }]
    });

    return message.content[0].text;
}

export const describeCommand = new Command('describe')
    .description('Generate English documentation from code files')
    .argument('<file>', 'Path to the code file to describe')
    .option('-o, --output <path>', 'Output file path (default: <input>.md)')
    .action(async (file: string, options: { output?: string }) => {
        try {
            console.log(chalk.blue(`Reading file: ${file}`));
            const code = await readFile(file, 'utf8');

            console.log(chalk.blue('Generating description...'));
            const explanation = await generateExplanation(code);

            const outputPath = options.output || path.join(
                path.dirname(file),
                path.basename(file, path.extname(file)) + '.md'
            );

            console.log(chalk.blue(`Writing description to: ${outputPath}`));
            await writeFile(outputPath, explanation, 'utf8');

            console.log(chalk.green('\nDescription generated successfully!'));
        } catch (error) {
            console.error(chalk.red('Error:'), error);
            process.exit(1);
        }
    }); 