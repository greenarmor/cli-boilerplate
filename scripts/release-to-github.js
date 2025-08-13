#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("GITHUB_TOKEN environment variable is required.");
  process.exit(1);
}

const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
const ownerRepo = execSync('git config --get remote.origin.url', { encoding: 'utf8' })
  .trim()
  .replace(/.*github.com[:/](.*?)\.git$/, '$1');

console.log(`Creating GitHub Release for ${tag} in ${ownerRepo}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const changelogCli = path.resolve(
  __dirname,
  '../node_modules/conventional-changelog-cli/cli.js'
);
const notes = execSync(`node ${changelogCli} -p angular -u -r 1`, { encoding: 'utf8' });

const payload = {
  tag_name: tag,
  name: tag,
  body: notes,
  draft: false,
  prerelease: false
};

const response = execSync(
  `curl -s -X POST https://api.github.com/repos/${ownerRepo}/releases ` +
  `-H "Authorization: token ${token}" ` +
  `-H "Content-Type: application/json" ` +
  `-d '${JSON.stringify(payload)}'`
);

console.log("GitHub Release created.");
