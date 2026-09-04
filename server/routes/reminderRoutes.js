import express from 'express';
import { db } from '../services/dbService.js';
import { dispatchManualReminder } from '../jobs/cronScheduler.js';

const router = express.Router();

// GET /api/reminders - List reminders with optional status & motherId filters
router.get('/', async (req, res, next) => {
  try {
    const { status, motherId, type } = req.query;
    let reminders = await db.find('reminders');

    if (status && status !== 'ALL') {
      reminders = reminders.filter(r => r.status === status);
    }
    if (motherId) {
      reminders = reminders.filter(r => r.motherId === motherId);
    }
    if (type) {
      reminders = reminders.filter(r => r.type === type);
    }

    // Sort by due date ascending
    reminders.sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));

    res.json({ success: true, count: reminders.length, data: reminders });
  } catch (err) {
    next(err);
  }
});

// POST /api/reminders - Create a new reminder
router.post('/', async (req, res, next) => {
  try {
    const {
      motherId,
      type = 'ANC_APPOINTMENT',
      title,
      dueDateTime,
      notes = ''
    } = req.body;

    if (!motherId || !title || !dueDateTime) {
      return res.status(400).json({
        success: false,
        error: 'motherId, title, and dueDateTime are required fields.'
      });
    }

    const mother = await db.findById('mothers', motherId);
    if (!mother) {
      return res.status(404).json({ success: false, error: 'Mother not found' });
    }

    const newReminder = await db.create('reminders', {
      motherId: mother.id,
      motherName: mother.name,
      phone: mother.phone,
      type,
      title: title.trim(),
      dueDateTime: new Date(dueDateTime).toISOString(),
      status: 'UPCOMING',
      notes: notes.trim()
    });

    res.status(201).json({ success: true, data: newReminder });
  } catch (err) {
    next(err);
  }
});

// PUT /api/reminders/:id - Update reminder (e.g. mark completed, reschedule)
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await db.updateById('reminders', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Reminder not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/reminders/:id/send-test - Send test reminder simulation
router.post('/:id/send-test', async (req, res, next) => {
  try {
    const result = await dispatchManualReminder(req.params.id);
    res.json({
      success: true,
      message: 'Test reminder dispatched successfully via WhatsApp simulation engine',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;
