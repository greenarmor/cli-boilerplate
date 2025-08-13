import fs from 'fs';
import path from 'path';
import os from 'os';
import loadScanners from '../scripts/utils/scanner-loader.js';

test('loads built-in scanners without local config', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scanner-loader-'));
  const scanners = await loadScanners(tmp);
  expect(typeof scanners.npm).toBe('function');
  expect(typeof scanners.zap).toBe('function');
  fs.rmSync(tmp, { recursive: true, force: true });
});
