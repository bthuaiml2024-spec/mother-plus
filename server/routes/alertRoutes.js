import express from 'express';
import { db } from '../services/dbService.js';

const router = express.Router();

// GET /api/alerts - List alerts
router.get('/', async (req, res, next) => {
  try {
    const { status, riskLevel } = req.query;
    let alerts = await db.find('alerts');

    if (status && status !== 'ALL') {
      alerts = alerts.filter(a => a.status === status);
    }
    if (riskLevel && riskLevel !== 'ALL') {
      alerts = alerts.filter(a => a.riskLevel === riskLevel);
    }

    // Sort newest first
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
});

// PUT /api/alerts/:id - Update alert status (ACKNOWLEDGED | RESOLVED)
router.put('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const alert = await db.findById('alerts', req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    const updated = await db.updateById('alerts', req.params.id, {
      status,
      lastReviewedAt: new Date().toISOString()
    });

    // If resolved, check if mother still has pending alerts. If none, reset mother risk from RED to GREEN/YELLOW
    if (status === 'RESOLVED' && alert.motherId) {
      const activeAlerts = await db.find('alerts', {
        motherId: alert.motherId,
        status: (s) => s !== 'RESOLVED'
      });
      if (activeAlerts.length === 0) {
        await db.updateById('mothers', alert.motherId, {
          riskLevel: 'GREEN',
          reminderStatus: 'Active'
        });
      }
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/alerts/:id/notes - Add healthcare worker clinical follow-up note
router.post('/:id/notes', async (req, res, next) => {
  try {
    const { author = 'Duty Healthcare Worker', text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Follow-up note text cannot be empty' });
    }

    const alert = await db.findById('alerts', req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    const newNote = {
      id: `note-${Date.now()}`,
      author,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    const notes = Array.isArray(alert.notes) ? [...alert.notes, newNote] : [newNote];

    const updated = await db.updateById('alerts', req.params.id, {
      notes,
      status: alert.status === 'PENDING_REVIEW' ? 'ACKNOWLEDGED' : alert.status
    });

    res.status(201).json({ success: true, data: updated, note: newNote });
  } catch (err) {
    next(err);
  }
});

export default router;
