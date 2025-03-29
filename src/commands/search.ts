import { mkdir } from 'fs/promises';
import type { SearchResult, SearchOptions } from '../types/index.js';
import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { getApiKey } from '../utils/api-keys.js';
import { getModelConfig } from '../utils/model-config.js';
import { AIService } from '../services/ai-service.js';
import * as constants from '../utils/constants.js';

const outputDirName = constants.OUTPUT_DIR_NAME;

interface GithubIssue {
    title: string;
    html_url: string;
    body: string;
}

interface StackOverflowPost {
    title: string;
    question_id: number;
    link: string;
    body: string;
}

async function searchGithubIssues(query: string, limit: number = 5): Promise<GithubIssue[]> {
    const githubToken = await getApiKey('github');
    if (!githubToken) {
        console.log(chalk.red('Error: GitHub token not configured'));
        return [];
    }
    
    const formattedQuery = `${query} is:issue`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(formattedQuery)}&per_page=${limit}`;
    
    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeAssistant/1.0'
    };

    headers['Authorization'] = `token ${githubToken}`;

    try {
        const response = await axios.get<{ items: GithubIssue[] }>(url, { headers });
        return response.data.items || [];
    } catch (error) {
        console.log(chalk.red(`Error searching GitHub: ${error instanceof Error ? error.message : String(error)}`));
        return [];
    }
}

async function searchStackoverflow(query: string, limit: number = 5): Promise<StackOverflowPost[]> {
    const url = 'https://api.stackexchange.com/2.3/search/advanced';
    const params = {
        q: query,
        site: 'stackoverflow',
        pagesize: limit,
        order: 'desc',
        sort: 'relevance'
    };

    try {
        const response = await axios.get<{ items: StackOverflowPost[] }>(url, { params });
        return response.data.items || [];
    } catch (error) {
        console.log(chalk.red(`Error searching Stack Overflow: ${error instanceof Error ? error.message : String(error)}`));
        return [];
    }
}

async function extractGithubContent(issueUrl: string): Promise<string> {
    try {
        const response = await axios.get(issueUrl);
        const $ = cheerio.load(response.data);
        const issueBody = $('.comment-body').first();
        return issueBody.text().trim() || 'No content found';
    } catch (error) {
        return 'Could not extract content';
    }
}

async function extractStackoverflowContent(questionId: number): Promise<string> {
    try {
        const url = `https://api.stackexchange.com/2.3/questions/${questionId}?site=stackoverflow&filter=withbody`;
        const response = await axios.get<{ items: StackOverflowPost[] }>(url);
        
        if (!response.data.items?.length) {
            return 'No content found';
        }

        const $ = cheerio.load(response.data.items[0].body);
        return $.text().trim();
    } catch (error) {
        return 'Could not extract content';
    }
}

async function analyzeWithLLM(context: string, query: string): Promise<string> {
    const modelConfig = await getModelConfig('search');
    const apiKey = await getApiKey(modelConfig.service);
    
    if (!apiKey) {
        console.log(chalk.red(`Error: ${modelConfig.service} API key not configured.`));
        console.log(chalk.yellow('\nTo configure your API key, run:'));
        console.log(chalk.blue(`  ai config ${modelConfig.service} <your-api-key>`));
        console.log(chalk.yellow('\nOr for help getting your API key, run:'));
        console.log(chalk.blue(`  ai config-help ${modelConfig.service}`));
        return 'Error: API key not configured';
    }

    try {
        const aiService = AIService.getInstance();
        const response = await aiService.analyzeSearchResults(context, query, modelConfig, apiKey);
        return response.text;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status' in error) {
            if (error.status === 401) {
                console.log(chalk.red(`Error: Invalid ${modelConfig.service} API key.`));
                console.log(chalk.yellow('\nPlease check your API key and try again:'));
                console.log(chalk.blue(`  ai config ${modelConfig.service} <your-api-key>`));
                console.log(chalk.yellow('\nOr for help getting your API key, run:'));
                console.log(chalk.blue(`  ai config-help ${modelConfig.service}`));
            }
        } else {
            console.error(chalk.red(`Error calling ${modelConfig.service} API:`), error);
        }
        return 'Error analyzing content with AI';
    }
}

async function runInteractiveMode(): Promise<void> {
    console.log(chalk.blue('===== Code Error Assistant ====='));
    console.log('Paste your error message or code question below and press Ctrl+D (Unix) or Ctrl+Z (Windows) when done:');

    const chunks: string[] = [];
    process.stdin.setEncoding('utf8');

    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }

    const query = chunks.join('').trim();
    if (!query) {
        console.log(chalk.red('No input provided. Exiting.'));
        return;
    }

    await runSearch(query);
}

async function saveResultsToFile(query: string, summary: string, sources: SearchResult[]): Promise<string> {
    console.log('Debug - Starting saveResultsToFile');
    console.log('Debug - outputDirName:', outputDirName);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `code_search_${timestamp}.md`;
    
    // Create .ai-cli directory in current working directory
    const outputDir = path.join(process.cwd(), outputDirName);
    console.log('Debug - outputDir:', outputDir);
    
    await mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, filename);

    const content = `# Code Search Analysis: ${query}

*Generated on ${new Date().toLocaleString()}*

## Summary

${summary}

## Sources

${sources.map((source, idx) => `${idx + 1}. [${source.title}](${source.url}) (${source.platform})`).join('\n')}
`;

    await fs.writeFile(outputPath, content, 'utf8');
    
    // Return relative path for better readability
    return path.relative(process.cwd(), outputPath);
}

async function runSearch(query: string, options: SearchOptions = { githubLimit: 3, stackoverflowLimit: 3 }): Promise<void> {
    console.log(chalk.green('\nAnalyzing this error/question:'));
    console.log(query.slice(0, 100) + (query.length > 100 ? '...' : ''));

    // Check for required API keys first
    const anthropicKey = await getApiKey('anthropic');
    const githubToken = await getApiKey('github');
    
    if (!anthropicKey) {
        console.log(chalk.red('Error: Anthropic API key not configured'));
        return;
    }

    if (!githubToken) {
        console.log(chalk.red('Error: GitHub token not configured'));
        return;
    }

    const githubResults = await searchGithubIssues(query, options.githubLimit);
    const stackoverflowResults = await searchStackoverflow(query, options.stackoverflowLimit);

    const contents: string[] = [];
    const sources: SearchResult[] = [];

    console.log(chalk.green('\nGathering GitHub content...'));
    for (const issue of githubResults) {
        const content = await extractGithubContent(issue.html_url);
        contents.push(`--- GitHub Issue: ${issue.title} ---\nURL: ${issue.html_url}\n${content}\n`);
        sources.push({
            title: issue.title,
            url: issue.html_url,
            platform: 'GitHub Issue'
        });
    }

    console.log(chalk.green('Gathering Stack Overflow content...'));
    for (const post of stackoverflowResults) {
        const content = await extractStackoverflowContent(post.question_id);
        contents.push(`--- Stack Overflow: ${post.title} ---\nURL: ${post.link}\n${content}\n`);
        sources.push({
            title: post.title,
            url: post.link,
            platform: 'Stack Overflow'
        });
    }

    const allContent = contents.join('\n\n');
    if (!allContent) {
        console.log(chalk.red('No relevant information found for this query.'));
        return;
    }

    console.log(chalk.green('Analyzing with AI...'));
    const analysis = await analyzeWithLLM(allContent, query);

    console.log(chalk.green('Saving results to file...'));
    const filename = await saveResultsToFile(query, analysis, sources);

    console.log(chalk.blue('\nAnalysis complete!'));
    console.log(chalk.green(`Results saved to: ${filename}`));
    console.log('\nAnalysis Summary:');
    console.log(analysis);
}

export const searchCommand = new Command('search')
    .description('Search for code solutions and troubleshooting')
    .argument('[query]', 'Error message or topic to search for')
    .option('-g, --github-limit <number>', 'Number of GitHub issues to search', '3')
    .option('-s, --stackoverflow-limit <number>', 'Number of Stack Overflow posts to search', '3')
    .action(async (query?: string, options?: { githubLimit: string; stackoverflowLimit: string }) => {
        if (!query) {
            return await runInteractiveMode();
        }
        await runSearch(query, {
            githubLimit: parseInt(options?.githubLimit || '3'),
            stackoverflowLimit: parseInt(options?.stackoverflowLimit || '3')
        });
    });
