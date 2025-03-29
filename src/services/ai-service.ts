import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { ModelConfig, SupportedService } from '../types/index.js';

export interface AIServiceOptions {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
}

export interface AIServiceResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

type AnthropicMessage = { role: 'user' | 'assistant'; content: string };
type OpenAIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export class AIService {
    private static instance: AIService;
    private constructor() {}

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    public async generateResponse(
        prompt: string,
        modelConfig: ModelConfig,
        apiKey: string,
        options: AIServiceOptions = {}
    ): Promise<AIServiceResponse> {
        const { maxTokens = 1000, temperature = 0.7, systemPrompt } = options;

        switch (modelConfig.service) {
            case 'anthropic': {
                const client = new Anthropic({ apiKey });
                const messages: AnthropicMessage[] = [];
                
                if (systemPrompt) {
                    messages.push({ role: 'user', content: systemPrompt });
                }
                messages.push({ role: 'user', content: prompt });

                const response = await client.messages.create({
                    model: modelConfig.model,
                    max_tokens: maxTokens,
                    temperature,
                    messages
                });

                return {
                    text: response.content[0].text,
                    usage: {
                        promptTokens: response.usage?.input_tokens ?? 0,
                        completionTokens: response.usage?.output_tokens ?? 0,
                        totalTokens: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0)
                    }
                };
            }

            case 'openai': {
                const client = new OpenAI({ apiKey });
                const messages: OpenAIMessage[] = [];
                
                if (systemPrompt) {
                    messages.push({ role: 'system', content: systemPrompt });
                }
                messages.push({ role: 'user', content: prompt });

                const response = await client.chat.completions.create({
                    model: modelConfig.model,
                    messages,
                    max_tokens: maxTokens,
                    temperature
                });

                const usage = response.usage;
                return {
                    text: response.choices[0]?.message?.content ?? 'No response from the model.',
                    usage: usage ? {
                        promptTokens: usage.prompt_tokens,
                        completionTokens: usage.completion_tokens,
                        totalTokens: usage.total_tokens
                    } : undefined
                };
            }

            case 'google-studio': {
                throw new Error('Google AI Studio is not supported for direct API calls');
            }

            default:
                throw new Error(`Unsupported service: ${modelConfig.service}`);
        }
    }

    public async analyzeCode(
        code: string,
        modelConfig: ModelConfig,
        apiKey: string,
        options: AIServiceOptions = {}
    ): Promise<AIServiceResponse> {
        const systemPrompt = `You are an AI specialized in analyzing source code and producing structured, plain-English representations of its functionality.

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
- Important considerations or dependencies`;

        return this.generateResponse(code, modelConfig, apiKey, { ...options, systemPrompt });
    }

    public async analyzeError(
        errors: string,
        code: string,
        modelConfig: ModelConfig,
        apiKey: string,
        options: AIServiceOptions = {}
    ): Promise<AIServiceResponse> {
        const systemPrompt = `You are a senior software engineer who excels at diagnosing and reasoning about complex errors.
Given the following errors and code snippet, provide:
1. A reasoning-based analysis of what is likely going wrong.
2. Step-by-step debugging strategies.
3. Suggested code changes if applicable.

Be thoughtful, step-by-step, and do not rush to a fix.`;

        const prompt = `Errors:\n${errors}\n\nCode:\n${code}`;
        return this.generateResponse(prompt, modelConfig, apiKey, { ...options, systemPrompt });
    }

    public async analyzeSearchResults(
        context: string,
        query: string,
        modelConfig: ModelConfig,
        apiKey: string,
        options: AIServiceOptions = {}
    ): Promise<AIServiceResponse> {
        const systemPrompt = `You are a coding assistant helping with troubleshooting. Based on the provided GitHub issues and Stack Overflow posts, provide:
1. A summary of the issue
2. Common solutions or workarounds
3. Additional insights or best practices

Make your response detailed but concise, and format your response with Markdown.`;

        const prompt = `Context:\n${context}\n\nOriginal Query: ${query}`;
        return this.generateResponse(prompt, modelConfig, apiKey, { ...options, systemPrompt });
    }
} 