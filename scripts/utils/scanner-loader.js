import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default async function loadScanners(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json');
  const rcPath = path.join(cwd, '.cli-scannersrc');
  const scanners = {};
  let entries = {};

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.cli && typeof pkg.cli.scanners === 'object') {
      entries = { ...entries, ...pkg.cli.scanners };
    }
  } catch {
    // ignore missing package.json or invalid JSON
  }

  try {
    if (fs.existsSync(rcPath)) {
      const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
      if (rc.cli && typeof rc.cli.scanners === 'object') {
        entries = { ...entries, ...rc.cli.scanners };
      }
    }
  } catch (err) {
    console.warn(`Failed to read ${rcPath}: ${err.message}`);
  }

  for (const [name, mod] of Object.entries(entries)) {
    try {
      const modulePath =
        mod.startsWith('.') || mod.startsWith('/')
          ? pathToFileURL(path.resolve(cwd, mod)).href
          : mod;
      const imported = await import(modulePath);
      scanners[name] = imported.default || imported;
    } catch (err) {
      console.warn(`Failed to load scanner ${name} from ${mod}: ${err.message}`);
    }
  }

  return scanners;
}
