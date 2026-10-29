import { execSync } from 'child_process';
import path from 'path';

console.log('=====================================================');
console.log('    NAGARSETU AI — MASTER INTEGRATION TEST SUITE     ');
console.log('=====================================================');

const tests = [
  'server/src/seed/test_phase2.js',
  'server/src/seed/test_phase3.js',
  'server/src/seed/test_phase4.js',
  'server/src/seed/test_phase5.js',
  'server/src/seed/test_phase6.js',
  'server/src/seed/test_phase7.js',
];

let passedCount = 0;

for (const testFile of tests) {
  console.log(`\n▶ Running: ${testFile}...`);
  try {
    const output = execSync(`node ${testFile}`, { encoding: 'utf8' });
    console.log(output);
    console.log(`✅ ${testFile} PASSED`);
    passedCount++;
  } catch (err) {
    console.error(`❌ ${testFile} FAILED:`, err.stdout || err.message);
    process.exit(1);
  }
}

console.log('\n=====================================================');
console.log(`MASTER TEST SUITE SUMMARY: ${passedCount} / ${tests.length} TEST SUITES PASSED (100%)`);
console.log('=====================================================');
