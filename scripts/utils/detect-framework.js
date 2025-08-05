import fs from 'fs';
import path from 'path';

const FRAMEWORK_DEPS = {
  react: ['react'],
  angular: ['@angular/core'],
  vue: ['vue']
};

export default function detectFramework(cwd = process.cwd()) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {})
    };
    const matches = Object.entries(FRAMEWORK_DEPS)
      .filter(([name, list]) => list.some(dep => deps[dep]))
      .map(([name]) => name);
    return matches.length === 1 ? matches[0] : null;
  } catch {
    return null;
  }
}
