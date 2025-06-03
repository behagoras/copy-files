import * as fs from 'fs-extra';
import * as path from 'path';
import {
  getIgnorePatterns,
  addIgnorePattern,
  removeIgnorePattern
} from './config';

// Function for ignore pattern management with persistent storage
export async function updateIgnore(add: string[] = [], remove: string[] = [], show: boolean = false): Promise<void> {
  if (show) {
    await showIgnorePatterns();
    return;
  }

  // Handle add operations
  for (const pattern of add) {
    await addIgnorePattern(pattern);
    console.log(`✅ Added ignore pattern: ${pattern}`);
  }

  // Handle remove operations
  for (const pattern of remove) {
    await removeIgnorePattern(pattern);
    console.log(`🗑️ Removed ignore pattern: ${pattern}`);
  }

  if (add.length === 0 && remove.length === 0) {
    console.log('💡 Use --add <pattern> or --remove <pattern> to manage ignore patterns');
    console.log('💡 Use --show to display current patterns');
    console.log('💡 Use ! prefix to include files that would otherwise be ignored');
  }
}

async function showIgnorePatterns(): Promise<void> {
  const currentDir = process.cwd();
  const gitignorePath = path.join(currentDir, '.gitignore');

  console.log('📋 Current Ignore Patterns');
  console.log('==========================');

  // Show .gitignore patterns
  if (await fs.pathExists(gitignorePath)) {
    try {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      const patterns = gitignoreContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      console.log('\n📁 From .gitignore:');
      if (patterns.length > 0) {
        patterns.forEach(pattern => console.log(`  • ${pattern}`));
      } else {
        console.log('  (no patterns found)');
      }
    } catch (error) {
      console.log('\n📁 From .gitignore: (error reading file)');
    }
  } else {
    console.log('\n📁 From .gitignore: (no .gitignore file found)');
  }

  // Show local config patterns
  try {
    const ignorePatterns = await getIgnorePatterns();

    console.log('\n⚙️ From local config (ignore.json):');
    console.log('  📛 Ignore patterns:');
    if (ignorePatterns.length > 0) {
      ignorePatterns.forEach(pattern => console.log(`    • ${pattern}`));
    } else {
      console.log('    (none)');
    }

    console.log('\n💡 Tips:');
    console.log('  • Use ! prefix to include files (e.g., "!important.log")');
    console.log('  • Patterns support glob syntax (e.g., "*.tmp", "temp/**")');
  } catch (error) {
    console.log('\n⚙️ From local config: (error reading config file)');
  }
} 