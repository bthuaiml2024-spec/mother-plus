import { evaluateHealthStatus, calculatePregnancyMetrics } from '../rules/healthRulesEngine.js';
import { db } from '../services/dbService.js';

async function runTests() {
  console.log('🧪 Starting MOTHER+ Automated Clinical Safety & Engine Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: GREEN triage evaluation
  const greenResult = evaluateHealthStatus({
    symptoms: [],
    gestationalWeek: 16,
    feelingGeneral: 'well'
  });
  assert(greenResult.level === 'GREEN', 'Healthy report evaluates to GREEN');
  assert(greenResult.alertRequired === false, 'GREEN report requires no alert');

  // Test 2: YELLOW triage evaluation
  const yellowResult = evaluateHealthStatus({
    symptoms: ['mild_swelling_feet', 'backache_mild'],
    gestationalWeek: 26,
    feelingGeneral: 'discomfort'
  });
  assert(yellowResult.level === 'YELLOW', 'Mild discomfort evaluates to YELLOW');
  assert(yellowResult.alertRequired === false, 'YELLOW requires no emergency alert');
  assert(yellowResult.flagForWorkerReview === true, 'YELLOW flags for worker review');

  // Test 3: RED triage evaluation (Pre-eclampsia danger signs)
  const redResult = evaluateHealthStatus({
    symptoms: ['severe_headache', 'blurred_vision'],
    gestationalWeek: 32,
    feelingGeneral: 'concerning'
  });
  assert(redResult.level === 'RED', 'Severe headache + blurred vision evaluates to RED');
  assert(redResult.alertRequired === true, 'RED danger sign triggers alertRequired');
  assert(redResult.detectedDangerSigns.includes('severe_headache'), 'Detects severe_headache');
  assert(redResult.detectedDangerSigns.includes('blurred_vision'), 'Detects blurred_vision');

  // Test 4: Immediate Emergency selection
  const emergencyResult = evaluateHealthStatus({
    feelingGeneral: 'emergency'
  });
  assert(emergencyResult.level === 'RED', 'Emergency choice evaluates immediately to RED');
  assert(emergencyResult.alertRequired === true, 'Emergency choice requires emergency alert');

  // Test 5: Pregnancy Metrics (140 days ago = 20 weeks)
  const lmp20WeeksAgo = new Date(Date.now() - 20 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const metrics = calculatePregnancyMetrics(lmp20WeeksAgo);
  assert(metrics !== null, 'Pregnancy calculation succeeds');
  assert(metrics.gestationalWeeks === 20, `Gestational weeks calculated correctly (expected 20, got ${metrics?.gestationalWeeks})`);
  assert(metrics.trimester === 2, `Trimester calculated correctly (expected 2, got ${metrics?.trimester})`);

  // Test 6: Database initialization
  await db.init();
  const mothers = await db.find('mothers');
  assert(mothers.length >= 3, `Demo seed initialized with ${mothers.length} sample mothers`);

  const alerts = await db.find('alerts');
  assert(alerts.length >= 2, `Demo seed initialized with ${alerts.length} sample alerts`);

  console.log(`\n=========================================`);
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`=========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
