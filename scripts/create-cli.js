#!/usr/bin/env node

import { execSync } from 'child_process';
const withEmoji = process.argv.includes('--with-emoji');

function log(msg, emoji) {
  console.log(withEmoji && emoji ? `${emoji} ${msg}` : msg);
}

import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];
if (!projectName) {
  console.error(
    withEmoji
      ? 'Please provide a CLI name.\nUsage: npx @greenarmor/cli-boilerplate <your-cli-name>'
      : 'Error: Please provide a CLI name.\nUsage: npx @greenarmor/cli-boilerplate <your-cli-name>'
  );
  process.exit(1);
}

const repo = 'https://github.com/greenarmor/cli-boilerplate.git';
console.log(` Creating a new CLI project: ${projectName}`);
execSync(`git clone --depth 1 ${repo} ${projectName}`, { stdio: 'inherit' });

// Rename all boilerplate references
const filesToEdit = [
  `${projectName}/package.json`,
  `${projectName}/README.md`,
  `${projectName}/bin/index.js`,
  `${projectName}/scripts/bump-cli.js`,
  `${projectName}/docs/index.md`,
];

filesToEdit.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content
    .replace(/@greenarmor\/cli-boilerplate/g, `@your-scope/${projectName}`)
    .replace(/cli-boilerplate/g, projectName)
    // Avoid replacing dependency names like conventional-changelog-cli
    .replace(/(?<!changelog-)\bcli\b/g, projectName);
  fs.writeFileSync(file, content);
});

console.log("Installing: Installing dependencies...");
execSync(`cd ${projectName} && npm install`, { stdio: 'inherit' });

console.log("Git: Initializing Git...");
execSync(`cd ${projectName} && rm -rf .git && git init && git add . && git commit -m "Initial commit from cli-boilerplate"`, { stdio: 'inherit' });

console.log(`Success: CLI "${projectName}" created and initialized!`);
console.log(`
Next steps:
cd ${projectName}
npm link
${projectName} --help`);

console.log(`\nDone: Your CLI is ready!\n`);
console.log(` _______      _____           ______ __________      ____________   `);
console.log(` |      |       |      ___    |_____|     | |  |     |_____|____/   `);
console.log(` |_____ |_______|__           |_____|_______|__|_____|_____|   \_   `);
console.log(`                                                                    `)
console.log(` Type 'cd ${projectName} && npm link && ${projectName} --help' to get started.\n`);
