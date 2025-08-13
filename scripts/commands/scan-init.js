import fs from 'fs';
import path from 'path';

export default function scanInit(cwd = process.cwd()) {
  const rcPath = path.join(cwd, '.cli-scannersrc');
  if (!fs.existsSync(rcPath)) {
    const sample = {
      cli: {
        scanners: {
          npm: '@greenarmor/cli-boilerplate/scripts/scanners/npm.js',
          zap: '@greenarmor/cli-boilerplate/scripts/scanners/zap.js',
        },
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(sample, null, 2));
    console.log('Created .cli-scannersrc with sample scanner definitions.');
  } else {
    console.log('.cli-scannersrc already exists.');
  }

  console.log('OWASP ZAP is not bundled. Install separately: https://www.zaproxy.org/download/');
  console.log('Use scanners only on systems you own or have explicit permission to test.');
}
