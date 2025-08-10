import fs from 'fs';
import path from 'path';
import os from 'os';
import generateService from '../scripts/commands/generate-service.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'service-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates service file with template substitution', () => {
  const name = 'Api';
  generateService(name, 'react');
  const filePath = path.join(tmpDir, 'src', 'services', `${name}.js`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});

test('creates service file in TypeScript when flag is set', () => {
  const name = 'TsApi';
  generateService(name, 'react', true);
  const filePath = path.join(tmpDir, 'src', 'services', `${name}.ts`);
  expect(fs.existsSync(filePath)).toBe(true);
  const content = fs.readFileSync(filePath, 'utf8');
  expect(content).toContain(name);
  expect(content).not.toMatch(/__NAME__/);
});
