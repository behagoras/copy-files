#!/usr/bin/env node

/**
 * copy-files
 * ----------------------
 * Commander-based CLI tool for copying files to clipboard or file
 */

import { Command } from 'commander';
import { copyToClipboard, writeToFile, updateIgnore } from './utils';
import packageJson from '../package.json';

const program = new Command();

program
  .name('copy-files')
  .description('Copy files from the current directory to clipboard or file')
  .version(packageJson.version)
  .option('--ignore <pattern...>', 'Ignore patterns (repeatable)', []);

// Copy subcommand (explicit clipboard copy)
program
  .command('copy')
  .description('Copy files to clipboard')
  .option('--ignore <pattern...>', 'Ignore patterns (repeatable)', [])
  .action(async (options) => {
    const { ignore = [] } = options;
    await copyToClipboard(ignore);
  });

// Directory subcommand (write to file)
program
  .command('directory')
  .description('Write files to output.md or specified path')
  .option('--path <filePath>', 'Output file path', 'output.md')
  .option('--ignore <pattern...>', 'Ignore patterns (repeatable)', [])
  .action(async (options) => {
    const { path: filePath, ignore = [] } = options;
    await writeToFile(filePath, ignore);
  });

// Ignore management subcommand
program
  .command('ignore')
  .description('Manage ignore patterns (use ! to include files)')
  .option('--add <pattern...>', 'Add ignore patterns', [])
  .option('--remove <pattern...>', 'Remove ignore patterns', [])
  .option('--show', 'Show current ignore patterns')
  .action(async (options) => {
    const { add = [], remove = [], show = false } = options;
    await updateIgnore(add, remove, show);
  });

// Check if we should run default behavior (copy to clipboard)
const args = process.argv.slice(2);
const hasCommand = args.some(arg => ['copy', 'directory', 'ignore', 'help'].includes(arg));
const hasHelpFlag = args.includes('--help') || args.includes('-h');
const hasVersionFlag = args.includes('--version') || args.includes('-V');

if (!hasCommand && !hasHelpFlag && !hasVersionFlag) {
  // Extract ignore options from args
  const ignoreIndex = args.indexOf('--ignore');
  
  let ignore: string[] = [];
  
  if (ignoreIndex !== -1 && ignoreIndex + 1 < args.length) {
    // Find all values after --ignore until next flag or end
    for (let i = ignoreIndex + 1; i < args.length && !args[i].startsWith('--'); i++) {
      ignore.push(args[i]);
    }
  }

  // Run default clipboard copy
  copyToClipboard(ignore).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
} else {
  // Parse command line arguments normally
  program.parse(process.argv);
}