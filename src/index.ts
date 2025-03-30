#!/usr/bin/env node --no-warnings

import { Command } from 'commander';
import { createCollectCommand } from './commands/collect.js';
import { configCommand } from './commands/config.js';
import { configHelpCommand } from './commands/config-help.js';
import { configListCommand } from './commands/config-list.js';
import { createDebugCommand } from './commands/debug.js';
import { createDescribeCommand } from './commands/describe.js';
import { helpCommand } from './commands/help.js';
import { searchCommand } from './commands/search.js';
import { createConfigModelCommand } from './commands/config-model.js';
import { worktreeCommand } from './commands/worktree.js';
import { worktreeMergeCommand } from './commands/worktree-merge.js';
import { worktreeRemoveCommand } from './commands/worktree-remove.js';
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

const program = new Command();

program
    .name('ai')
    .description('AI-powered CLI tools for developers')
    .version(packageJson.version);

program
    .addCommand(helpCommand)
    .addCommand(searchCommand)
    .addCommand(createCollectCommand())
    .addCommand(configCommand)
    .addCommand(configListCommand)
    .addCommand(configHelpCommand)
    .addCommand(createConfigModelCommand())
    .addCommand(createDescribeCommand())
    .addCommand(createDebugCommand())
    .addCommand(worktreeCommand)
    .addCommand(worktreeMergeCommand)
    .addCommand(worktreeRemoveCommand);

program.parse();
