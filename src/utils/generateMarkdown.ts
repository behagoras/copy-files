import * as fs from 'fs-extra';
import * as path from 'path';
import ignore from 'ignore';
import { processDirectory } from './processDirectory';
import { getIgnorePatterns } from './ignore';

export async function generateMarkdown(customIgnore: string[] = []): Promise<string> {
  const currentDir = process.cwd();
  const gitignorePath = path.join(currentDir, '.gitignore');

  // Initialize the ignore instance
  let ig = ignore();

  // If a .gitignore file exists, read it and load the ignore rules
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    ig = ignore().add(gitignoreContent);
  }

  // Add patterns from local config files
  try {
    const localIgnorePatterns = await getIgnorePatterns();
    if (localIgnorePatterns.length > 0) {
      ig = ig.add(localIgnorePatterns);
    }
  } catch (error) {
    console.warn('Warning: Could not load local ignore patterns:', error);
  }

  // Add custom ignore patterns from CLI
  if (customIgnore.length > 0) {
    ig = ig.add(customIgnore);
  }

  let markdownContent = '';
  markdownContent = await processDirectory(currentDir, ig, markdownContent, currentDir);

  return markdownContent;
} 