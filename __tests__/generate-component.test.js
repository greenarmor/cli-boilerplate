import fs from 'fs';
import path from 'path';
import os from 'os';
import generateComponent from '../scripts/commands/generate-component.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'comp-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates component file with template substitution', () => {
  const name = 'Button';
  generateComponent(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'components', name, `${name}.jsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});

test('creates component file in TypeScript when flag is set', () => {
  const name = 'TsButton';
  generateComponent(name, 'react', true);
  const filePath = path.join(tmpDir, 'src', 'components', name, `${name}.tsx`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});
