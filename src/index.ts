#!/usr/bin/env node

import { Command } from 'commander';
import { collectCommand } from './commands/collect.js';
import { configCommand } from './commands/config.js';
import { configListCommand } from './commands/config-list.js';
import { searchCommand } from './commands/search.js';
import { configHelpCommand } from './commands/config-help.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get package.json version
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
    readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

const program = new Command();
program
    .name('ai')
    .description('CLI for AI tools')
    .version(packageJson.version);

program
    .addCommand(searchCommand)
    .addCommand(configCommand)
    .addCommand(configListCommand)
    .addCommand(configHelpCommand)
    .addCommand(collectCommand);

program.parse(); 