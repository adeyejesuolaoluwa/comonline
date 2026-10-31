import { readFile, writeFile } from 'node:fs/promises';
const directory = process.argv[2] || 'artifacts';
const artifact = (name) => new URL(`../${directory}/${name}`, import.meta.url);
const report = { generated: new Date().toISOString(), lighthouse: {} };
for (const name of ['baseline', 'home', 'book']) {
  const data = JSON.parse(await readFile(artifact(`lighthouse-${name}-mobile.json`), 'utf8'));
  report.lighthouse[name] = {
    url: data.requestedUrl,
    fetched: data.fetchTime,
    version: data.lighthouseVersion,
    browser: data.environment?.hostUserAgent,
    settings: data.configSettings,
    scores: Object.fromEntries(Object.entries(data.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map((key) => [key, { display: data.audits[key].displayValue, value: data.audits[key].numericValue }])),
    runtimeError: data.runtimeError ?? null,
    warnings: data.runWarnings
  };
}
const qa = JSON.parse(await readFile(new URL('../artifacts/qa/report.json', import.meta.url), 'utf8'));
report.browserQA = {
  browsers: qa.browsers,
  layoutChecks: qa.layouts.length,
  axeChecks: qa.accessibility.length,
  interactionGroups: qa.interactions.length,
  violations: qa.accessibility.reduce((sum, check) => sum + check.violations.length, 0),
  failures: qa.failures,
  unavailable: qa.unavailable
};
try {
  report.refinementQA = JSON.parse(await readFile(artifact('interaction-report.json'), 'utf8'));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
try {
  report.sceneQA = JSON.parse(await readFile(artifact('scene-report.json'), 'utf8'));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(artifact('summary.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
