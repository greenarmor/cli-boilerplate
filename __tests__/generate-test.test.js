import fs from 'fs';
import path from 'path';
import os from 'os';
import generateTest from '../scripts/commands/generate-test.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'testgen-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates test file with template substitution', () => {
  const name = 'Widget';
  generateTest(name, 'react');
  const filePath = path.join(tmpDir, 'src', '__tests__', name, `${name}.test.js`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});
