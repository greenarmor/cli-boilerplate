import fs from 'fs';
import path from 'path';

const LEVELS = ['info', 'low', 'moderate', 'high', 'critical'];

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
  const options = parseArgs(argv);
  const target = options.target || '.';
  const scannerName = options.scanner || 'npm';
  const report = options.report ? path.resolve(options.report) : null;
  const severity = options.severity || 'high';

  let scannerFn;
  try {
    const mod = await import(`../scanners/${scannerName}.js`);
    scannerFn = mod.default || mod;
  } catch {
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
  const raw = results.raw || findings;

  if (report) {
    fs.writeFileSync(report, JSON.stringify(raw, null, 2));
    console.log(`Report written to ${report}`);
  }

  const thresholdIdx = LEVELS.indexOf(normalizeSeverity(severity));
  const highIdx = LEVELS.indexOf('high');
  let exitCode = 0;

  for (const finding of findings) {
    const idx = LEVELS.indexOf(normalizeSeverity(finding.severity));
    if (idx >= thresholdIdx || idx >= highIdx) {
      exitCode = 1;
      break;
    }
  }

  if (exitCode !== 0) {
    console.error('High severity vulnerabilities detected.');
  } else {
    console.log('No high severity vulnerabilities found.');
  }

  return exitCode;
}
