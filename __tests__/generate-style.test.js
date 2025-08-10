import fs from 'fs';
import path from 'path';
import os from 'os';
import generateStyle from '../scripts/commands/generate-style.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'style-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates style file with template substitution', () => {
  const name = 'Button';
  generateStyle(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'styles', name, `${name}.module.css`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name.toLowerCase());
  expect(content).not.toMatch(/__NAME/);
});
