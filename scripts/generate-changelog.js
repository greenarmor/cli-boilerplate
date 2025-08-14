#!/usr/bin/env node

import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


try {
  const cliPath = path.resolve(__dirname, '../node_modules/conventional-changelog-cli/cli.js');
  execFileSync('node', [cliPath, '-p', 'angular', '-i', 'CHANGELOG.md', '-s', '-r', '0'], {
    stdio: 'inherit'
  });
  console.log('Changelog generated successfully.');
} catch (err) {
  console.error('Failed to generate changelog:', err.message);
  process.exit(1);
}
