import express from 'express';
import { db } from '../services/dbService.js';
import { calculatePregnancyMetrics } from '../rules/healthRulesEngine.js';

const router = express.Router();

// GET /api/dashboard/stats - Overview metrics for Healthcare Worker Dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const mothers = await db.find('mothers');
    const alerts = await db.find('alerts');
    const reminders = await db.find('reminders');

    // Live update mothers' gestational age for accurate trimester metrics
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;
    const trimesterCounts = { trimester1: 0, trimester2: 0, trimester3: 0 };

    mothers.forEach(m => {
      const metrics = calculatePregnancyMetrics(m.lmpDate);
      const trimester = metrics?.trimester || m.trimester || 1;
      
      if (trimester === 1) trimesterCounts.trimester1++;
      else if (trimester === 2) trimesterCounts.trimester2++;
      else trimesterCounts.trimester3++;

      if (m.riskLevel === 'RED') redCount++;
      else if (m.riskLevel === 'YELLOW') yellowCount++;
      else greenCount++;
    });

    const pendingAlerts = alerts.filter(a => a.status === 'PENDING_REVIEW').length;
    const upcomingAppointments = reminders.filter(r => r.status === 'UPCOMING').length;
    const missedAppointments = reminders.filter(r => r.status === 'MISSED').length;

    res.json({
      success: true,
      data: {
        totalMothers: mothers.length,
        greenMothers: greenCount,
        yellowMothers: yellowCount,
        redMothers: redCount,
        pendingAlerts,
        totalAlerts: alerts.length,
        upcomingAppointments,
        missedAppointments,
        trimesterDistribution: trimesterCounts
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/dashboard/reset-demo - Restore initial seed data for hackathon demo
router.post('/reset-demo', async (req, res, next) => {
  try {
    await db.resetDemo();
    res.json({
      success: true,
      message: 'Demo state successfully restored with clean pristine data.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
