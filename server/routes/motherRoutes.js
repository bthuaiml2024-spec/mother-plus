import express from 'express';
import { db } from '../services/dbService.js';
import { calculatePregnancyMetrics } from '../rules/healthRulesEngine.js';

const router = express.Router();

// GET /api/mothers - List all registered mothers with search & filters
router.get('/', async (req, res, next) => {
  try {
    const { risk, search, facility, village } = req.query;
    let mothers = await db.find('mothers');
    const allHealthChecks = await db.find('healthChecks');

    // Filter by risk level
    if (risk && risk !== 'ALL') {
      mothers = mothers.filter(m => m.riskLevel === risk);
    }

    // Filter by facility
    if (facility) {
      mothers = mothers.filter(m => 
        m.healthcareFacility?.toLowerCase().includes(facility.toLowerCase())
      );
    }

    // Filter by village
    if (village) {
      mothers = mothers.filter(m => 
        m.village?.toLowerCase().includes(village.toLowerCase()) ||
        m.location?.toLowerCase().includes(village.toLowerCase())
      );
    }

    // Search by name, phone, village, location, facility, or worker
    if (search) {
      const q = search.toLowerCase().trim();
      const numQ = search.replace(/\D/g, '');
      mothers = mothers.filter(m => {
        const nameMatch = m.name?.toLowerCase().includes(q);
        const phoneMatch = numQ ? m.phone?.replace(/\D/g, '').includes(numQ) : m.phone?.includes(q);
        const villageMatch = m.village?.toLowerCase().includes(q);
        const locationMatch = m.location?.toLowerCase().includes(q);
        const facilityMatch = m.healthcareFacility?.toLowerCase().includes(q);
        const workerMatch = m.healthcareWorker?.toLowerCase().includes(q);
        return nameMatch || phoneMatch || villageMatch || locationMatch || facilityMatch || workerMatch;
      });
    }

    // Attach live pregnancy metrics and last health check to each mother
    mothers = mothers.map(m => {
      const metrics = calculatePregnancyMetrics(m.lmpDate || m.eddDate || m.gestationalWeeks);
      
      // Find latest health check
      const motherChecks = allHealthChecks
        .filter(hc => hc.motherId === m.id)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      const lastCheck = motherChecks[0] || null;

      return {
        ...m,
        gestationalWeeks: metrics ? metrics.gestationalWeeks : m.gestationalWeeks,
        trimester: metrics ? metrics.trimester : m.trimester,
        eddDate: metrics ? metrics.eddDate : m.eddDate,
        lastHealthCheck: lastCheck ? {
          level: lastCheck.level,
          submittedAt: lastCheck.submittedAt,
          feelingGeneral: lastCheck.feelingGeneral,
          symptoms: lastCheck.symptoms
        } : null
      };
    });

    res.json({ success: true, count: mothers.length, data: mothers });
  } catch (err) {
    next(err);
  }
});

// GET /api/mothers/:id - Detailed profile with linked alerts, reminders, and health checks
router.get('/:id', async (req, res, next) => {
  try {
    const mother = await db.findById('mothers', req.params.id);
    if (!mother) {
      return res.status(404).json({ success: false, error: 'Maternal record not found' });
    }

    const metrics = calculatePregnancyMetrics(mother.lmpDate || mother.eddDate || mother.gestationalWeeks);
    const updatedMother = {
      ...mother,
      gestationalWeeks: metrics ? metrics.gestationalWeeks : mother.gestationalWeeks,
      trimester: metrics ? metrics.trimester : mother.trimester,
      eddDate: metrics ? metrics.eddDate : mother.eddDate
    };

    const reminders = await db.find('reminders', { motherId: mother.id });
    const alerts = await db.find('alerts', { motherId: mother.id });
    const healthChecks = await db.find('healthChecks', { motherId: mother.id });

    // Sort newest first
    healthChecks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    reminders.sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));

    res.json({
      success: true,
      data: {
        ...updatedMother,
        reminders,
        alerts,
        healthChecks,
        lastHealthCheck: healthChecks[0] || null
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/mothers - Register a new pregnant mother
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      age,
      phone,
      village = 'Rural District',
      location = '',
      preferredLanguage = 'en',
      lmpDate,
      eddDate,
      gestationalWeeks,
      pregnancyType = 'Single pregnancy',
      bloodGroup = 'Unknown',
      healthcareFacility = 'Primary Health Centre',
      healthcareWorker = 'Assigned ANM / ASHA',
      emergencyContact = '',
      notes = ''
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Mother full name is required.'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required.'
      });
    }

    const cleanPhoneDigits = phone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number.'
      });
    }

    // Check duplicate registration by normalized phone number
    const existingMothers = await db.find('mothers');
    const duplicate = existingMothers.find(m => {
      const existingDigits = m.phone.replace(/\D/g, '');
      return existingDigits.includes(cleanPhoneDigits) || cleanPhoneDigits.includes(existingDigits);
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: `Phone number ${phone} is already registered under ${duplicate.name} (ID: ${duplicate.id}).`,
        existingMother: duplicate
      });
    }

    // Calculate pregnancy metrics from LMP, EDD, or gestationalWeeks
    const metrics = calculatePregnancyMetrics({
      lmpDate,
      eddDate,
      gestationalWeeks: gestationalWeeks ? Number(gestationalWeeks) : undefined
    });

    if (!metrics) {
      return res.status(400).json({
        success: false,
        error: 'Please provide pregnancy timing: either valid Last Menstrual Period (LMP) date (YYYY-MM-DD), Expected Due Date (EDD), or current pregnancy week number.'
      });
    }

    // Generate unique Mother ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uniqueMotherId = `MOTH-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const newMother = await db.create('mothers', {
      id: uniqueMotherId,
      name: name.trim(),
      age: Number(age) || 24,
      phone: phone.trim(),
      village: village.trim() || 'Village Area',
      location: (location || village || 'Primary Health Area').trim(),
      preferredLanguage: preferredLanguage === 'ta' ? 'ta' : 'en',
      lmpDate: metrics.lmpDate,
      eddDate: metrics.eddDate,
      gestationalWeeks: metrics.gestationalWeeks,
      trimester: metrics.trimester,
      pregnancyType,
      bloodGroup,
      healthcareFacility,
      healthcareWorker,
      emergencyContact: emergencyContact.trim(),
      riskLevel: 'GREEN',
      reminderStatus: 'Active',
      isDemo: false,
      notes: notes.trim()
    });

    // Automatically schedule initial ANC appointment reminder (e.g. in 10-14 days)
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    await db.create('reminders', {
      motherId: newMother.id,
      motherName: newMother.name,
      phone: newMother.phone,
      type: 'ANC_APPOINTMENT',
      title: `Routine ANC Checkup (Week ${metrics.gestationalWeeks + 2})`,
      dueDateTime: dueDate,
      status: 'UPCOMING',
      notes: `Initial registration follow-up at ${healthcareFacility}. Check maternal weight, BP, and hemoglobin.`
    });

    res.status(201).json({
      success: true,
      message: 'Mother registered successfully in MOTHER+ Maternal Care System',
      data: newMother,
      metrics
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/mothers/:id - Update maternal details
router.put('/:id', async (req, res, next) => {
  try {
    const mother = await db.findById('mothers', req.params.id);
    if (!mother) {
      return res.status(404).json({ success: false, error: 'Mother record not found' });
    }

    let updates = { ...req.body };
    if (updates.lmpDate || updates.eddDate || updates.gestationalWeeks) {
      const metrics = calculatePregnancyMetrics({
        lmpDate: updates.lmpDate,
        eddDate: updates.eddDate,
        gestationalWeeks: updates.gestationalWeeks
      });
      if (metrics) {
        updates.gestationalWeeks = metrics.gestationalWeeks;
        updates.trimester = metrics.trimester;
        updates.eddDate = metrics.eddDate;
        updates.lmpDate = metrics.lmpDate;
      }
    }

    const updated = await db.updateById('mothers', req.params.id, updates);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
