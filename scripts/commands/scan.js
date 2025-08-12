import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const LEVELS = ['low', 'moderate', 'high', 'critical'];

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

export default function runScan(argv = []) {
  const options = parseArgs(argv);
  const target = options.target || '.';
  const scanner = options.scanner || 'npm';
  const report = options.report ? path.resolve(options.report) : null;
  const severity = options.severity || 'high';

  if (scanner !== 'npm') {
    console.error(`Unsupported scanner: ${scanner}`);
    return 1;
  }

  const result = spawnSync('npm', ['audit', '--json'], {
    cwd: target,
    encoding: 'utf8',
  });

  if (result.error) {
    console.error('Failed to run npm audit:', result.error.message);
    return result.status || 1;
  }

  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch (err) {
    console.error('Unable to parse scanner output');
    return 1;
  }

  if (report) {
    fs.writeFileSync(report, JSON.stringify(data, null, 2));
    console.log(`Report written to ${report}`);
  }

  const vulns = data.metadata?.vulnerabilities || {};
  const thresholdIdx = LEVELS.indexOf(severity);
  const highIdx = LEVELS.indexOf('high');
  let exitCode = 0;

  for (const level of LEVELS) {
    const idx = LEVELS.indexOf(level);
    if ((vulns[level] || 0) > 0 && (idx >= thresholdIdx || idx >= highIdx)) {
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
