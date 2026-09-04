/**
 * End-to-End API and Flow Verification Script for MOTHER+
 */

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('🚀 Starting MOTHER+ End-to-End API Verification...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, detail = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} -> ${detail}`);
      failed++;
    }
  }

  // 1. Health Probe
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  assert(healthRes.status === 'healthy', 'GET /api/health probe returns healthy');

  // 2. Dashboard Stats
  const statsRes = await fetch(`${BASE_URL}/dashboard/stats`).then(r => r.json());
  assert(statsRes.success === true, 'GET /api/dashboard/stats returns success');
  assert(statsRes.data.totalMothers >= 3, 'Dashboard reports at least 3 initial demo mothers');

  // 3. Mothers List
  const mothersRes = await fetch(`${BASE_URL}/mothers`).then(r => r.json());
  assert(mothersRes.success === true, 'GET /api/mothers returns mother list');
  assert(mothersRes.data.length >= 3, `Found ${mothersRes.data.length} registered mothers`);

  // 4. Maternal Registration
  const lmp24w = new Date(Date.now() - 24 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const uniqueDigits = Date.now().toString().slice(-8);
  const newMotherPayload = {
    name: 'Shanthi Devi',
    age: 25,
    phone: `+91 98${uniqueDigits}`,
    preferredLanguage: 'ta',
    lmpDate: lmp24w,
    healthcareFacility: 'Poonamallee CHC',
    emergencyContact: '+91 99999 22222 (Brother)'
  };
  const regRes = await fetch(`${BASE_URL}/mothers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMotherPayload)
  }).then(r => r.json());

  assert(regRes.success === true, 'POST /api/mothers registers mother');
  assert(regRes.data.gestationalWeeks === 24, `Calculates pregnancy week 24 correctly (got ${regRes.data.gestationalWeeks})`);
  assert(regRes.data.riskLevel === 'GREEN', 'Initial maternal risk level is GREEN');
  const createdMotherId = regRes.data.id;

  // 5. Test GREEN Health Check
  const greenCheckRes = await fetch(`${BASE_URL}/health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      motherId: createdMotherId,
      feelingGeneral: 'well',
      symptoms: []
    })
  }).then(r => r.json());
  assert(greenCheckRes.data.evaluation.level === 'GREEN', 'Well check evaluates to GREEN');
  assert(greenCheckRes.data.evaluation.alertRequired === false, 'GREEN check creates no alert');

  // 6. Test YELLOW Health Check
  const yellowCheckRes = await fetch(`${BASE_URL}/health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      motherId: createdMotherId,
      feelingGeneral: 'discomfort',
      symptoms: ['mild_swelling_feet', 'mild_fatigue']
    })
  }).then(r => r.json());
  assert(yellowCheckRes.data.evaluation.level === 'YELLOW', 'Discomfort evaluates to YELLOW');

  // 7. Test RED Health Check (Danger Signs: severe headache + blurred vision)
  const redCheckRes = await fetch(`${BASE_URL}/health-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      motherId: createdMotherId,
      feelingGeneral: 'concerning',
      symptoms: ['severe_headache', 'blurred_vision']
    })
  }).then(r => r.json());
  assert(redCheckRes.data.evaluation.level === 'RED', 'Severe headache + blurred vision evaluates to RED');
  assert(redCheckRes.data.evaluation.alertRequired === true, 'RED evaluation has alertRequired: true');
  assert(Boolean(redCheckRes.data.alertRecord), 'RED evaluation creates new Alert record');
  const alertId = redCheckRes.data.alertRecord.id;

  // 8. Verify Alert in /api/alerts
  const alertsRes = await fetch(`${BASE_URL}/alerts?riskLevel=RED`).then(r => r.json());
  assert(alertsRes.data.some(a => a.id === alertId), 'Alert is listed in /api/alerts');

  // 9. Acknowledge Alert and Add Clinical Follow-up Note
  const ackRes = await fetch(`${BASE_URL}/alerts/${alertId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'ACKNOWLEDGED' })
  }).then(r => r.json());
  assert(ackRes.data.status === 'ACKNOWLEDGED', 'Alert status updated to ACKNOWLEDGED');

  const noteRes = await fetch(`${BASE_URL}/alerts/${alertId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'Sister Lakshmi (ANM)',
      text: 'Visited Shanthi at home. Blood pressure is 145/95. Immediate ambulance arranged to Taluk Hospital.'
    })
  }).then(r => r.json());
  assert(noteRes.success === true, 'Clinical follow-up note successfully added to alert');

  // 10. Test Reminders & Send Test Reminder simulation
  const remListRes = await fetch(`${BASE_URL}/reminders`).then(r => r.json());
  assert(remListRes.data.length > 0, 'Found scheduled reminders');

  const testRemId = remListRes.data[0].id;
  const sendTestRes = await fetch(`${BASE_URL}/reminders/${testRemId}/send-test`, {
    method: 'POST'
  }).then(r => r.json());
  assert(sendTestRes.success === true, 'POST /api/reminders/:id/send-test dispatches reminder');
  assert(Boolean(sendTestRes.data.sentMessageText), 'Reminder contains simulated message text');

  // 11. WhatsApp Webhook Verification
  const webhookVerifyRes = await fetch(`${BASE_URL}/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=mother_plus_verify_token_2026&hub.challenge=test_challenge_12345`);
  const challengeText = await webhookVerifyRes.text();
  assert(challengeText === 'test_challenge_12345', 'Meta WhatsApp Webhook verification succeeds');

  // 12. WhatsApp Webhook Inbound Message
  const webhookMsgRes = await fetch(`${BASE_URL}/whatsapp/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: '+919840112345',
      text: 'menu'
    })
  }).then(r => r.json());
  assert(webhookMsgRes.success === true, 'POST /api/whatsapp/webhook handles simulated inbound message');

  // 13. Health Tips API
  const tipsRes = await fetch(`${BASE_URL}/tips`).then(r => r.json());
  assert(tipsRes.data.length >= 8, 'GET /api/tips returns educational tips collection');

  console.log(`\n==============================================`);
  console.log(`E2E Verification: ${passed} Passed, ${failed} Failed`);
  console.log(`==============================================\n`);

  if (failed > 0) process.exit(1);
}

runE2ETests().catch(err => {
  console.error('E2E runner crashed:', err);
  process.exit(1);
});
