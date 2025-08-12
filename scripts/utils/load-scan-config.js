import fs from 'fs';
import path from 'path';

export default function loadScanConfig(cwd = process.cwd()) {
  const rcPath = path.join(cwd, '.cli-scannersrc');
  try {
    if (fs.existsSync(rcPath)) {
      return JSON.parse(fs.readFileSync(rcPath, 'utf8'));
    }
  } catch (err) {
    console.warn(`Failed to read ${rcPath}: ${err.message}`);
  }

  const pkgPath = path.join(cwd, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.scan && typeof pkg.scan === 'object') {
      return pkg.scan;
    }
  } catch {
    // ignore missing package.json or invalid JSON
  }

  return {};
}
