import fs from 'fs';
import path from 'path';
import os from 'os';
import generateAuthLogin from '../scripts/commands/generate-authlogin.js';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'authlogin-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('generates JWT auth files in JavaScript', () => {
  generateAuthLogin('auth', 'react');
  const base = path.join(tmpDir, 'auth');
  const serverPath = path.join(base, 'server.js');
  const clientPath = path.join(base, 'client.js');
  const schemaPath = path.join(base, 'schema.sql');

  expect(fs.existsSync(serverPath)).toBe(true);
  expect(fs.existsSync(clientPath)).toBe(true);
  expect(fs.existsSync(schemaPath)).toBe(true);

  const server = fs.readFileSync(serverPath, 'utf8');
  expect(server).toContain('jwt.sign');
  expect(server).toContain('jwt.verify');

  const client = fs.readFileSync(clientPath, 'utf8');
  expect(client).toContain("localStorage.setItem('token', token)");
  expect(client).toContain('Bearer ${token}');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  expect(schema).toContain('CREATE TABLE IF NOT EXISTS users');
});

test('generates JWT auth files in TypeScript', () => {
  generateAuthLogin('auth', 'react', true);
  const base = path.join(tmpDir, 'auth');
  const serverPath = path.join(base, 'server.ts');
  const clientPath = path.join(base, 'client.ts');
  const schemaPath = path.join(base, 'schema.sql');

  expect(fs.existsSync(serverPath)).toBe(true);
  expect(fs.existsSync(clientPath)).toBe(true);
  expect(fs.existsSync(schemaPath)).toBe(true);

  const server = fs.readFileSync(serverPath, 'utf8');
  expect(server).toContain('jwt.sign');
  expect(server).toContain('jwt.verify');

  const client = fs.readFileSync(clientPath, 'utf8');
  expect(client).toContain("localStorage.setItem('token', token)");
  expect(client).toContain('Bearer ${token}');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  expect(schema).toContain('CREATE TABLE IF NOT EXISTS users');
});

