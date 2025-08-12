import fs from 'fs';
import path from 'path';

const LEVELS = ['info', 'low', 'moderate', 'high', 'critical'];

function normalizeSeverity(level = '') {
  const l = level.toLowerCase();
  if (l === 'medium') return 'moderate';
  if (l === 'informational' || l === 'info') return 'info';
  return l;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Output scan findings as a table and optional JSON/HTML report file.
 * @param {Array} findings - List of findings objects.
 * @param {object} [opts]
 * @param {string} [opts.report] - Path to report file (.json or .html).
 * @param {string} [opts.severity] - Minimum severity to include.
 * @returns {Array} Filtered findings.
 */
export default function scanReport(findings = [], opts = {}) {
  const report = opts.report;
  const severity = opts.severity || 'info';
  const thresholdIdx = LEVELS.indexOf(normalizeSeverity(severity));

  const filtered = findings.filter((f) => {
    const idx = LEVELS.indexOf(normalizeSeverity(f.severity));
    return idx >= thresholdIdx;
  });

  if (filtered.length > 0) {
    const table = filtered.map((f) => ({
      severity: normalizeSeverity(f.severity),
      description: f.description || '',
      url: f.url || '',
      remediation: f.remediation || '',
    }));
    console.table(table);
  }

  if (report) {
    const ext = path.extname(report).toLowerCase();
    if (ext === '.html') {
      const rows = filtered
        .map(
          (f) =>
            `<tr><td>${escapeHtml(normalizeSeverity(f.severity))}</td><td>${escapeHtml(
              f.description || ''
            )}</td><td>${escapeHtml(f.url || '')}</td><td>${escapeHtml(
              f.remediation || ''
            )}</td></tr>`
        )
        .join('');
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Scan Report</title></head><body><table border="1"><thead><tr><th>Severity</th><th>Description</th><th>URL</th><th>Remediation</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
      fs.writeFileSync(report, html);
    } else {
      fs.writeFileSync(report, JSON.stringify(filtered, null, 2));
    }
    console.log(`Report written to ${report}`);
  }

  return filtered;
}
