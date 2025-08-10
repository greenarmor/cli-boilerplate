import fs from 'fs';
import path from 'path';
import os from 'os';
import generatePage from '../scripts/commands/generate-page.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'page-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates page file with template substitution', () => {
  const name = 'Home';
  generatePage(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'pages', name, `${name}.jsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});

test('creates page file in TypeScript when flag is set', () => {
  const name = 'TsHome';
  generatePage(name, 'react', true);
  const filePath = path.join(tmpDir, 'src', 'pages', name, `${name}.tsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});
