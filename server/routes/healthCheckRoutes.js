import express from 'express';
import { db } from '../services/dbService.js';
import { evaluateHealthStatus, DANGER_SIGNS, MILD_DISCOMFORTS } from '../rules/healthRulesEngine.js';

const router = express.Router();

// GET /api/health-check/meta/symptoms - Taxonomy of symptoms for WhatsApp UI and check-in forms
router.get('/meta/symptoms', (req, res) => {
  res.json({
    success: true,
    data: {
      dangerSigns: DANGER_SIGNS,
      mildDiscomforts: MILD_DISCOMFORTS
    }
  });
});

// POST /api/health-check - Submit daily health check-in
router.post('/', async (req, res, next) => {
  try {
    const {
      motherId,
      phone,
      feelingGeneral = 'well', // 'well' | 'discomfort' | 'concerning' | 'emergency'
      symptoms = []
    } = req.body;

    let mother = null;
    if (motherId) {
      mother = await db.findById('mothers', motherId);
    } else if (phone) {
      const cleanDigits = phone.replace(/\D/g, '');
      const allMothers = await db.find('mothers');
      mother = allMothers.find(m => {
        const mDigits = m.phone.replace(/\D/g, '');
        return mDigits.includes(cleanDigits) || cleanDigits.includes(mDigits);
      });
    }

    const gestationalWeek = mother?.gestationalWeeks || 20;

    // Run Deterministic Health Screening Rules Engine
    const evaluation = evaluateHealthStatus({
      symptoms,
      gestationalWeek,
      feelingGeneral
    });

    const motherLocation = mother?.location || mother?.village || req.body.location || 'Rural Health Centre';
    const motherVillage = mother?.village || req.body.village || 'Community Area';

    // Save Health Check Record
    const checkRecord = await db.create('healthChecks', {
      motherId: mother ? mother.id : 'unregistered-patient',
      motherName: mother ? mother.name : (req.body.name || 'Unregistered Mother'),
      phone: mother ? mother.phone : (phone || 'N/A'),
      village: motherVillage,
      location: motherLocation,
      feelingGeneral,
      symptoms,
      level: evaluation.level,
      alertRequired: evaluation.alertRequired,
      message: evaluation.message,
      tamilMessage: evaluation.tamilMessage,
      dangerSignsTextEn: evaluation.dangerSignsTextEn || null,
      dangerSignsTextTa: evaluation.dangerSignsTextTa || null,
      submittedAt: new Date().toISOString()
    });

    // If RED: Trigger Urgent Alert for Healthcare Worker Dashboard
    let alertRecord = null;
    if (evaluation.level === 'RED') {
      alertRecord = await db.create('alerts', {
        motherId: mother ? mother.id : checkRecord.motherId,
        motherName: mother ? mother.name : checkRecord.motherName,
        phone: mother ? mother.phone : checkRecord.phone,
        village: motherVillage,
        location: motherLocation,
        gestationalWeeks: gestationalWeek,
        riskLevel: 'RED',
        reportedSymptoms: evaluation.dangerSignsTextEn ? [evaluation.dangerSignsTextEn] : ['Emergency reported'],
        recommendedAction: evaluation.recommendedAction,
        tamilAction: evaluation.tamilAction,
        status: 'PENDING_REVIEW',
        assignedWorker: mother?.healthcareWorker || 'Assigned ANM / Medical Officer',
        healthCheckId: checkRecord.id,
        isDemo: Boolean(mother?.isDemo),
        notes: []
      });

      // Update mother risk tier
      if (mother) {
        await db.updateById('mothers', mother.id, {
          riskLevel: 'RED',
          reminderStatus: 'URGENT ESCALATION REQUIRED'
        });
      }
    } else if (evaluation.level === 'YELLOW') {
      if (mother && mother.riskLevel !== 'RED') {
        await db.updateById('mothers', mother.id, {
          riskLevel: 'YELLOW',
          reminderStatus: 'Follow-up Due'
        });
      }
    } else if (evaluation.level === 'GREEN') {
      if (mother) {
        // Only reset to GREEN if no unresolved pending RED alerts exist
        const pendingAlerts = await db.find('alerts', {
          motherId: mother.id,
          status: 'PENDING_REVIEW'
        });
        if (pendingAlerts.length === 0) {
          await db.updateById('mothers', mother.id, {
            riskLevel: 'GREEN',
            reminderStatus: 'Active'
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        checkRecord,
        evaluation,
        alertRecord
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/health-check/:motherId - Get check-in history for a mother
router.get('/:motherId', async (req, res, next) => {
  try {
    const checks = await db.find('healthChecks', { motherId: req.params.motherId });
    checks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json({ success: true, count: checks.length, data: checks });
  } catch (err) {
    next(err);
  }
});

export default router;
