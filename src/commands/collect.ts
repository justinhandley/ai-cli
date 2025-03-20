import { Command } from 'commander';
import chalk from 'chalk';
import { globby } from 'globby';
import untildify from 'untildify';
import { readFile, appendFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import open from 'open';

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
            const outputFile = path.join(process.cwd(), `$${fileName}.txt`);

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
            await open(path.dirname(outputFile));
        } catch (error) {
            console.error(chalk.red('Error collecting files:'), error);
            process.exit(1);
        }
    }); 