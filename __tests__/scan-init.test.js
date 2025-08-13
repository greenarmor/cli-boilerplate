import fs from 'fs';
import path from 'path';
import os from 'os';
import { jest } from '@jest/globals';

const originalCwd = process.cwd();
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-init-'));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('creates .cli-scannersrc and logs notices', async () => {
  const { default: scanInit } = await import('../scripts/commands/scan-init.js');
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  scanInit();

  const rcPath = path.join(tmpDir, '.cli-scannersrc');
  expect(fs.existsSync(rcPath)).toBe(true);

  const output = logSpy.mock.calls.map((c) => c.join(' ')).join('\n');
  logSpy.mockRestore();

  expect(output).toMatch(/ZAP/i);
  expect(output).toMatch(/permission to test/i);
});
