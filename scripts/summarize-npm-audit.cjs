const fs = require('node:fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/summarize-npm-audit.cjs <audit-json-file>');
  process.exit(2);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (error) {
  console.error(`Could not read npm audit JSON: ${error.message}`);
  process.exit(2);
}

const counts = report.metadata?.vulnerabilities || {};
console.log(`npm audit totals: ${JSON.stringify(counts)}`);

for (const [name, vulnerability] of Object.entries(report.vulnerabilities || {})) {
  const advisories = (vulnerability.via || [])
    .filter((item) => typeof item === 'object')
    .map((item) => `${item.title || 'Advisory'}: ${item.url || 'URL unavailable'}`)
    .join(' | ');

  console.log([
    vulnerability.severity.toUpperCase(),
    name,
    `range=${vulnerability.range || 'unknown'}`,
    `direct=${Boolean(vulnerability.isDirect)}`,
    `fixAvailable=${JSON.stringify(vulnerability.fixAvailable ?? false)}`,
    advisories || 'No advisory details returned'
  ].join(' | '));
}
