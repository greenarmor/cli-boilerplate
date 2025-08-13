import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

export default async function loadScanners(cwd = process.cwd()) {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const modulePkg = path.resolve(moduleDir, '../../package.json');
  const pkgPath = path.join(cwd, 'package.json');
  const rcPath = path.join(cwd, '.cli-scannersrc');
  const scanners = {};
  const entries = {};

  function addEntries(configPath) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg.cli && typeof cfg.cli.scanners === 'object') {
        for (const [name, mod] of Object.entries(cfg.cli.scanners)) {
          if (typeof mod !== 'string') continue;
          let resolved = mod;
          if (mod.startsWith('.') || mod.startsWith('/')) {
            resolved = path.resolve(path.dirname(configPath), mod);
            if (!fs.existsSync(resolved)) {
              console.warn(
                `Skipping scanner ${name} from ${configPath}: ${resolved} not found`
              );
              continue;
            }
          }
          entries[name] = resolved;
        }
      }
    } catch {
      // ignore missing or invalid config
    }
  }

  addEntries(modulePkg);
  if (pkgPath !== modulePkg) addEntries(pkgPath);
  addEntries(rcPath);

  for (const [name, mod] of Object.entries(entries)) {
    try {
      const modulePath = mod.startsWith('/')
        ? pathToFileURL(mod).href
        : mod;
      const imported = await import(modulePath);
      scanners[name] = imported.default || imported;
    } catch (err) {
      console.warn(`Failed to load scanner ${name} from ${mod}: ${err.message}`);
    }
  }

  return scanners;
}
