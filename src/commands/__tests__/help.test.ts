import { describe, beforeEach, test, expect, vi } from 'vitest';
import { helpCommand } from '../help.js';
import chalk from 'chalk';

describe('help command', () => {
    let consoleLogSpy: any;

    beforeEach(() => {
        // Spy on console.log to capture output
        consoleLogSpy = vi.spyOn(console, 'log');
    });

    test('displays all commands in the correct format', async () => {
        // Execute the help command
        await helpCommand.parseAsync(['node', 'help']);

        // Get all console.log calls
        const output = consoleLogSpy.mock.calls.map(call => call[0]).join('\n');

        // Verify the main sections are present
        expect(output).toContain('AI CLI Commands');
        expect(output).toContain('Usage: ai <command> [options]');
        expect(output).toContain('Commands:');
        expect(output).toContain('Options:');
        expect(output).toContain('Examples:');
        expect(output).toContain('For more information:');

        // Verify all commands are listed
        expect(output).toContain('search <query>');
        expect(output).toContain('collect [directory]');
        expect(output).toContain('config <service> <key>');
        expect(output).toContain('config-list');
        expect(output).toContain('config-help <service>');
        expect(output).toContain('help');

        // Verify command descriptions
        expect(output).toContain('Search for code solutions and troubleshooting');
        expect(output).toContain('Collect TypeScript files from a directory');
        expect(output).toContain('Set API key for a service');
        expect(output).toContain('List all configured API keys');
        expect(output).toContain('Show help for configuring a specific service');
        expect(output).toContain('Show this help message');

        // Verify global options
        expect(output).toContain('-h, --help');
        expect(output).toContain('-V, --version');

        // Verify examples
        expect(output).toContain('ai search "how to handle errors"');
        expect(output).toContain('ai collect ./src');
        expect(output).toContain('ai config anthropic your-api-key');
        expect(output).toContain('ai config-help anthropic');

        // Verify the help message for getting more information
        expect(output).toContain('Run "ai <command> --help" for more information about a command');
    });

    test('uses correct chalk colors for formatting', async () => {
        // Execute the help command
        await helpCommand.parseAsync(['node', 'help']);

        // Get all console.log calls
        const output = consoleLogSpy.mock.calls.map(call => call[0]).join('\n');

        // Verify the main title is blue and bold
        expect(output).toContain(chalk.blue.bold('AI CLI Commands'));

        // Verify section headers are yellow and bold
        expect(output).toContain(chalk.yellow.bold('Commands:'));
        expect(output).toContain(chalk.yellow.bold('Options:'));
        expect(output).toContain(chalk.yellow.bold('Examples:'));
        expect(output).toContain(chalk.yellow.bold('For more information:'));

        // Verify command descriptions are gray
        expect(output).toContain(chalk.gray('Usage: ai <command> [options]'));
        expect(output).toContain(chalk.gray('  search <query>              Search for code solutions and troubleshooting'));
        expect(output).toContain(chalk.gray('  collect [directory]         Collect TypeScript files from a directory'));
    });
}); 