#!/usr/bin/env node

/**
 * copy-files
 * ----------------------
 * This script reads all files from the current directory and subdirectories,
 * ignoring those specified in .gitignore, and writes them into a single Markdown snippet.
 * Each file will appear under a top-level heading (# relative/path/to/filename) and in a fenced code block
 * using the file's extension.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import ignore from 'ignore';

async function generateMarkdownSnippet() {
  const currentDir = process.cwd();
  const gitignorePath = path.join(currentDir, '.gitignore');

  // Initialize the ignore instance
  let ig = ignore();

  // If a .gitignore file exists, read it and load the ignore rules
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    ig = ignore().add(gitignoreContent);
  }

  // This will collect the final Markdown content
  let markdownContent = '';

  // Recursive function to process directories
  async function processDirectory(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(currentDir, fullPath);

      // Check if this item should be ignored
      if (ig.ignores(relativePath)) {
        continue;
      }

      // Also skip node_modules or .git in case they're not in .gitignore
      if (item.name === 'node_modules' || item.name === '.git') {
        continue;
      }

      if (item.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else {
        // Read file content
        const fileContent = await fs.readFile(fullPath, 'utf8');

        // Determine file extension (remove leading dot)
        const ext = path.extname(item.name);
        const extWithoutDot = ext ? ext.replace('.', '') : 'text';

        // Build the snippet for this file
        markdownContent += `# ${relativePath}\n\n\`\`\`${extWithoutDot}\n${fileContent}\n\`\`\`\n\n`;
      }
    }
  }

  // Start processing from the current directory
  await processDirectory(currentDir);

  // Write the collected markdown content to "output.md"
  const outputPath = path.join(currentDir, 'output.md');
  await fs.writeFile(outputPath, markdownContent, 'utf8');

  console.log('Markdown snippet generated successfully in "output.md".');
}

// Execute the main function, and handle any errors
generateMarkdownSnippet().catch(error => {
  console.error('Error generating markdown snippet:', error);
  process.exit(1);
});