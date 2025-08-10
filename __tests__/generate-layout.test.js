import fs from 'fs';
import path from 'path';
import os from 'os';
import generateLayout from '../scripts/commands/generate-layout.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates layout file with template substitution', () => {
  const name = 'Main';
  generateLayout(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'layouts', name, `${name}.jsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).toContain(name.toLowerCase());
  expect(content).not.toMatch(/__NAME__/);
  expect(content).not.toMatch(/__NAME_LOWER__/);
});

test('creates layout file in TypeScript when flag is set', () => {
  const name = 'TsMain';
  generateLayout(name, 'react', true);
  const filePath = path.join(tmpDir, 'src', 'layouts', name, `${name}.tsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).toContain(name.toLowerCase());
  expect(content).not.toMatch(/__NAME__/);
  expect(content).not.toMatch(/__NAME_LOWER__/);
});
