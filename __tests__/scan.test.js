import { jest } from '@jest/globals';

const mockScanner = jest.fn();
const mockLoadScanners = jest.fn(async () => ({ mock: mockScanner }));
const mockLoadConfig = jest.fn(() => ({}));

jest.unstable_mockModule('../scripts/utils/scanner-loader.js', () => ({
  default: mockLoadScanners,
}));

jest.unstable_mockModule('../scripts/utils/load-scan-config.js', () => ({
  default: mockLoadConfig,
}));

const { default: runScan } = await import('../scripts/commands/scan.js');

describe('scan command', () => {
  beforeEach(() => {
    mockScanner.mockReset();
    mockLoadConfig.mockReset();
    mockLoadScanners.mockClear();
  });

  test('parses options and forwards to scanner', async () => {
    mockScanner.mockResolvedValueOnce({ findings: [] });
    mockLoadConfig.mockReturnValueOnce({ severity: 'low' });

    await runScan(['--scanner', 'mock', '--target', '/tmp/project', '--severity', 'high']);

    expect(mockScanner).toHaveBeenCalledWith(
      '/tmp/project',
      expect.objectContaining({
        scanner: 'mock',
        target: '/tmp/project',
        severity: 'high',
      })
    );
  });

  test('returns exit code 1 when findings meet severity threshold', async () => {
    mockScanner.mockResolvedValueOnce({ findings: [{ severity: 'high' }] });

    const code = await runScan(['--scanner', 'mock', '--severity', 'high']);

    expect(code).toBe(1);
  });

  test('returns exit code 0 when no findings meet threshold', async () => {
    mockScanner.mockResolvedValueOnce({ findings: [{ severity: 'low' }] });

    const code = await runScan(['--scanner', 'mock', '--severity', 'high']);

    expect(code).toBe(0);
  });
});

