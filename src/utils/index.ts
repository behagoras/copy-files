// Re-export all functions from their individual files
export { processDirectory } from './processDirectory';
export { generateMarkdown } from './generateMarkdown';
export { copyToClipboard } from './copyToClipboard';
export { writeToFile } from './writeToFile';
export { updateIgnore } from './updateIgnore';

// Re-export config functions
export * from './config'; 