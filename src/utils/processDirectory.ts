import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as path from 'path';

// Recursive function to process directories and build markdown content
export async function processDirectory(dir: string, ig: ignore.Ignore, markdownContent: string, currentDir: string): Promise<string> {
  // First check if the current directory itself should be ignored
  // Normalize to POSIX-style paths for ignore matching
  const currentRelativePath = path
    .relative(currentDir, dir)
    .split(path.sep)
    .join('/');
  if (currentRelativePath && (ig.ignores(currentRelativePath) || ig.ignores(currentRelativePath + '/'))) {
    return markdownContent; // Skip this entire directory
  }

  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path
      .relative(currentDir, fullPath)
      .split(path.sep)
      .join('/');

    // Check if this item should be ignored
    const shouldIgnore = ig.ignores(relativePath) ||
      ig.ignores(item.name) ||
      (item.isDirectory() && ig.ignores(relativePath + '/')) ||
      (item.isDirectory() && ig.ignores(item.name + '/'));

    if (shouldIgnore) {
      continue;
    }

    // Also skip node_modules or .git in case they're not in .gitignore
    if (item.name === 'node_modules' || item.name === '.git') {
      continue;
    }

    if (item.isDirectory()) {
      // Recursively process subdirectories
      markdownContent = await processDirectory(fullPath, ig, markdownContent, currentDir);
    } else {
      try {
        // Read file content
        const fileContent = await fs.readFile(fullPath, 'utf8');

        // Determine file extension (remove leading dot)
        const ext = path.extname(item.name);
        const extWithoutDot = ext ? ext.replace('.', '') : 'text';

        // Build the snippet for this file
        markdownContent += `# ${relativePath}\n\n\`\`\`${extWithoutDot}\n${fileContent}\n\`\`\`\n\n`;
      } catch (error) {
        console.warn(`Skipping file ${relativePath}: ${error}`);
      }
    }
  }

  return markdownContent;
}