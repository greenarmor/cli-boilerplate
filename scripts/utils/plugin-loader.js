import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default async function loadPlugins(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json');
  const collected = { generateRoutes: {}, rootCommands: [] };

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const plugins = pkg.cli && Array.isArray(pkg.cli.plugins) ? pkg.cli.plugins : [];

    for (const mod of plugins) {
      try {
        const modulePath = mod.startsWith('.') || mod.startsWith('/')
          ? pathToFileURL(path.resolve(cwd, mod)).href
          : mod;
        const imported = await import(modulePath);
        const plugin = imported.default || imported;
        if (plugin.generateRoutes && typeof plugin.generateRoutes === 'object') {
          Object.assign(collected.generateRoutes, plugin.generateRoutes);
        }
        if (Array.isArray(plugin.rootCommands)) {
          collected.rootCommands.push(...plugin.rootCommands);
        }
      } catch (err) {
        console.warn(`Failed to load plugin ${mod}: ${err.message}`);
      }
    }
  } catch {
    // ignore missing package.json or invalid JSON
  }

  return collected;
}
