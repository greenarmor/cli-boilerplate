import { spawnSync } from 'child_process';

/**
 * Run npm audit and return standardized findings.
 * @param {string} target - Path to scan.
 * @param {object} [opts]
 * @returns {{raw: object, findings: Array<{url:string, description:string, severity:string}>}}
 */
export default function npmScanner(target = '.', opts = {}) {
  const result = spawnSync('npm', ['audit', '--json'], {
    cwd: target,
    encoding: 'utf8',
  });

  if (result.error) {
    throw new Error(`Failed to run npm audit: ${result.error.message}`);
  }

  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch (err) {
    throw new Error('Unable to parse scanner output');
  }

  const findings = [];
  // npm v7+ uses 'vulnerabilities' summary; advisories may be under 'advisories'
  if (data.advisories) {
    for (const adv of Object.values(data.advisories)) {
      findings.push({
        url: adv.url || '',
        description: adv.title || adv.module_name || '',
        severity: (adv.severity || '').toLowerCase(),
      });
    }
  } else if (data.vulnerabilities) {
    for (const [pkg, info] of Object.entries(data.vulnerabilities)) {
      if (Array.isArray(info.via)) {
        for (const via of info.via) {
          if (typeof via === 'object') {
            findings.push({
              url: via.url || '',
              description: via.title || pkg,
              severity: (via.severity || '').toLowerCase(),
            });
          }
        }
      }
    }
  }

  return { raw: data, findings };
}
