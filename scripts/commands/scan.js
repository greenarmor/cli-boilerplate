import path from 'path';
import loadScanners from '../utils/scanner-loader.js';
import loadScanConfig from '../utils/load-scan-config.js';
import scanReport from '../utils/scan-report.js';

function parseArgs(args = []) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        opts[key] = next;
        i++;
      } else {
        opts[key] = true;
      }
    }
  }
  return opts;
}

function normalizeSeverity(level = '') {
  const l = level.toLowerCase();
  if (l === 'medium') return 'moderate';
  if (l === 'informational' || l === 'info') return 'info';
  return l;
}

export default async function runScan(argv = []) {
  const defaults = loadScanConfig();
  const options = { ...defaults, ...parseArgs(argv) };
  const scanners = await loadScanners();
  const target = options.target || '.';
  const scannerName = options.scanner || Object.keys(scanners)[0] || 'npm';
  const report = options.report ? path.resolve(options.report) : null;
  const severity = options.severity || 'high';

  const scannerFn = scanners[scannerName];
  if (!scannerFn) {
    console.error(`Unsupported scanner: ${scannerName}`);
    return 1;
  }

  let results;
  try {
    results = await scannerFn(target, options);
  } catch (err) {
    console.error(`Failed to run ${scannerName} scanner: ${err.message}`);
    return 1;
  }

  const findings = results.findings || [];

  const filtered = scanReport(findings, { report, severity });

  const exitCode = filtered.length > 0 ? 1 : 0;

  if (exitCode !== 0) {
    console.error(
      `${filtered.length} vulnerabilities of severity ${normalizeSeverity(
        severity
      )} or higher detected.`
    );
  } else {
    console.log(
      `No vulnerabilities of severity ${normalizeSeverity(
        severity
      )} or higher found.`
    );
  }

  return exitCode;
}
