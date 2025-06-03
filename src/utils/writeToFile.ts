import * as fs from 'fs-extra';
import * as path from 'path';
import { generateMarkdown } from './generateMarkdown';

export async function writeToFile(filePath?: string, customIgnore: string[] = []): Promise<void> {
  try {
    const markdownContent = await generateMarkdown(customIgnore);
    const outputPath = filePath || path.join(process.cwd(), 'output.md');

    await fs.writeFile(outputPath, markdownContent, 'utf8');
    console.log(`✅ Files written to ${outputPath} successfully!`);
  } catch (error) {
    console.error('Error writing to file:', error);
    throw error;
  }
} 