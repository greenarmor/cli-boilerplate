import fs from 'fs';
import path from 'path';
import os from 'os';
import generateContext from '../scripts/commands/generate-context.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'context-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates context file with template substitution', () => {
  const name = 'Auth';
  generateContext(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'context', `${name}Context.js`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});
