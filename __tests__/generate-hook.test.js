import fs from 'fs';
import path from 'path';
import os from 'os';
import generateHook from '../scripts/commands/generate-hook.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates hook file with template substitution', () => {
  const name = 'Auth';
  generateHook(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'hooks', `use${name}.js`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(`use${name}`);
  expect(content).not.toMatch(/__NAME__/);
});
