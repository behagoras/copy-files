import { spawn } from 'child_process';
import { generateMarkdown } from './generateMarkdown';

export async function copyToClipboard(customIgnore: string[] = []): Promise<void> {
  try {
    const markdownContent = await generateMarkdown(customIgnore);

    // Copy to clipboard using pbcopy (macOS) or xclip (Linux)
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    let command: string;
    let args: string[] = [];

    if (isMac) {
      command = 'pbcopy';
    } else if (isWindows) {
      command = 'clip';
    } else {
      // Linux
      command = 'xclip';
      args = ['-selection', 'clipboard'];
    }

    const child = spawn(command, args);

    child.stdin.write(markdownContent);
    child.stdin.end();

    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Files copied to clipboard successfully!');
          resolve(undefined);
        } else {
          reject(new Error(`Copy to clipboard failed with code ${code}`));
        }
      });
      child.on('error', reject);
    });
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
} 