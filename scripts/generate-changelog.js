#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  execSync('npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0', {
    stdio: 'inherit'
  });
  console.log('Changelog generated successfully.');
} catch (err) {
  console.error('Failed to generate changelog:', err.message);
  process.exit(1);
}
