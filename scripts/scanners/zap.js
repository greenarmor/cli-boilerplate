import { spawnSync } from 'child_process';

/**
 * Run OWASP ZAP baseline scan against a target URL.
 * @param {string} target - Target URL to scan.
 * @param {object} [opts]
 * @param {string} [opts.zapPath] - Path to zap-baseline.py or zap.sh command.
 * @param {string[]} [opts.args] - Additional command line arguments.
 * @returns {{raw: object, findings: Array<{url:string, description:string, severity:string}>}}
 */
export default function zapScanner(target, opts = {}) {
  const zapCmd = opts.zapPath || 'zap-baseline.py';
  const args = ['-t', target, '-J', '-'];
  if (Array.isArray(opts.args)) {
    args.push(...opts.args);
  }

  const result = spawnSync(zapCmd, args, {
    encoding: 'utf8',
  });

  if (result.error) {
    throw new Error(`Failed to run ZAP: ${result.error.message}`);
  }

  let raw;
  try {
    raw = JSON.parse(result.stdout);
  } catch (err) {
    throw new Error('Unable to parse ZAP output');
  }

  const findings = [];
  const sites = raw.site || [];
  for (const site of sites) {
    const alerts = site.alerts || [];
    for (const alert of alerts) {
      const description = alert.name || alert.alert || '';
      const severityRaw = (alert.riskdesc || alert.risk || '').split(' ')[0];
      const severity = severityRaw ? severityRaw.toLowerCase() : '';
      const instances = alert.instances || [];
      if (instances.length === 0) {
        findings.push({
          url: site['@name'] || target,
          description,
          severity,
        });
      } else {
        for (const inst of instances) {
          findings.push({
            url: inst.uri || inst.url || site['@name'] || target,
            description,
            severity,
          });
        }
      }
    }
  }

  return { raw, findings };
}
