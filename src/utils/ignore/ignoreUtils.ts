import * as fs from 'fs-extra';
import * as path from 'path';

const CONFIG_DIR = path.join(process.cwd());
const IGNORE_FILE = path.join(CONFIG_DIR, 'ignore.json');

// Default patterns
const DEFAULT_IGNORE = ['node_modules', 'output.md'];

export async function getIgnorePatterns(): Promise<string[]> {
  try {
    if (await fs.pathExists(IGNORE_FILE)) {
      const content = await fs.readFile(IGNORE_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      // Create file with defaults
      await fs.writeFile(IGNORE_FILE, JSON.stringify(DEFAULT_IGNORE, null, 2), 'utf8');
      return DEFAULT_IGNORE;
    }
  } catch (error) {
    console.warn('Error reading ignore.json, using defaults:', error);
    return DEFAULT_IGNORE;
  }
}

export async function saveIgnorePatterns(patterns: string[]): Promise<void> {
  await fs.writeFile(IGNORE_FILE, JSON.stringify(patterns, null, 2), 'utf8');
}

export async function addIgnorePattern(pattern: string): Promise<void> {
  const patterns = await getIgnorePatterns();
  if (!patterns.includes(pattern)) {
    patterns.push(pattern);
    await saveIgnorePatterns(patterns);
  }
}

export async function removeIgnorePattern(pattern: string): Promise<void> {
  const patterns = await getIgnorePatterns();
  const filtered = patterns.filter(p => p !== pattern);
  await saveIgnorePatterns(filtered);
} 