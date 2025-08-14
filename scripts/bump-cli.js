#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync, execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const unreleased = args.includes('-u') || args.includes('--unreleased');
const githubRelease = args.includes('--github-release');
let releaseCount = 1;
const rIndex = args.findIndex((a) => a === '-r' || a === '--release-count');
if (rIndex !== -1) {
  const val = args[rIndex + 1];
  if (val && !val.startsWith('-')) {
    releaseCount = val;
  }
}

const bumpOptions = ['patch', 'minor', 'major'];

const { type } = await inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: 'Select the version bump type:',
    choices: bumpOptions
  }
]);

console.log(`\nGit Log Preview:\n`);
try {
  const log = execSync('git log --oneline -n 5', { encoding: 'utf8' });
  console.log(log);
} catch (err) {
  console.error('Failed to show git log.');
}

console.log(`\nCHANGELOG Preview:\n`);
try {
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8').split('\n').slice(0, 15).join('\n');
  console.log(changelog || 'No changelog content yet.');
} catch (err) {
  console.warn('No CHANGELOG.md file found.');
}

console.log(`\nGitHub Release Notes (generated):\n`);
try {
  const changelogCli = path.resolve(__dirname, '../node_modules/conventional-changelog-cli/cli.js');
  const flags = ['-p', 'angular', '-r', String(releaseCount)];
  if (unreleased) flags.push('-u');
  const releaseNotes = execFileSync('node', [changelogCli, ...flags], { encoding: 'utf8' });
  console.log(releaseNotes || 'No generated release notes.');
} catch (err) {
  console.warn('Failed to generate GitHub release notes.');
}

if (dryRun) {
  console.log(`\nDry Run: Skipping actual bump, push, and publish.`);
  process.exit(0);
}

const { confirm } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'confirm',
    message: `Proceed with ${type} bump?`,
    default: true
  }
]);

if (!confirm) {
  console.log('Aborted by user.');
  process.exit(0);
}

try {
  execSync(`npm version ${type} -m "chore(release): bump version to %s"`, { stdio: 'inherit' });

  const { pushToGitHub } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'pushToGitHub',
      message: 'Push commit and tag to GitHub?',
      default: true
    }
  ]);

  if (pushToGitHub) {
    execSync('git push && git push --tags', { stdio: 'inherit' });
    console.log('Git push complete.');
  }

  const { publishToNpm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'publishToNpm',
      message: 'Publish to npm now?',
      default: false
    }
  ]);

  if (publishToNpm) {
    execSync('npm publish --access public', { stdio: 'inherit' });
    console.log('npm publish complete.');
  }

  if (githubRelease) {
    execSync('node scripts/release-to-github.js', { stdio: 'inherit' });
  }

  console.log('\nVersion bump complete.');

} catch (err) {
  console.error('Error:', err.message);
}
