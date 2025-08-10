import fs from 'fs';
import path from 'path';

const defaultConfig = {
  components: {
    dir: 'src/components/__NAME__',
    file: '__NAME__.jsx'
  },
  pages: {
    dir: 'src/pages/__NAME__',
    file: '__NAME__.jsx'
  },
  hooks: {
    dir: 'src/hooks',
    file: 'use__NAME__.js'
  },
  layouts: {
    dir: 'src/layouts/__NAME__',
    file: '__NAME__.jsx'
  },
  services: {
    dir: 'src/services',
    file: '__NAME__.js'
  },
  contexts: {
    dir: 'src/context',
    file: '__NAME__Context.js'
  },
  styles: {
    dir: 'src/styles/__NAME__',
    file: '__NAME__.module.css'
  },
  tests: {
    dir: 'src/__tests__/__NAME__',
    file: '__NAME__.test.js'
  }
};

export default function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'cli.config.json');

  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const merged = { ...defaultConfig };
      Object.keys(userConfig).forEach(key => {
        if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key]) && merged[key]) {
          merged[key] = { ...merged[key], ...userConfig[key] };
        } else {
          merged[key] = userConfig[key];
        }
      });
      return merged;
    } catch (err) {
      console.error('Error loading cli.config.json:', err);
    }
  }

  return defaultConfig;
}

