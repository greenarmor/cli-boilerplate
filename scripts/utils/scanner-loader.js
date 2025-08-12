import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default async function loadScanners(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json');
  const scanners = {};

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const entries = pkg.cli && typeof pkg.cli.scanners === 'object' ? pkg.cli.scanners : {};

    for (const [name, mod] of Object.entries(entries)) {
      try {
        const modulePath = mod.startsWith('.') || mod.startsWith('/')
          ? pathToFileURL(path.resolve(cwd, mod)).href
          : mod;
        const imported = await import(modulePath);
        scanners[name] = imported.default || imported;
      } catch (err) {
        console.warn(`Failed to load scanner ${name} from ${mod}: ${err.message}`);
      }
    }
  } catch {
    // ignore missing package.json or invalid JSON
  }

  return scanners;
}
