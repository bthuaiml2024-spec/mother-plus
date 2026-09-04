import express from 'express';
import { HEALTH_TIPS } from '../data/healthTipsData.js';

const router = express.Router();

// GET /api/tips - List health & nutrition tips with optional category/trimester filter
router.get('/', (req, res) => {
  const { category, trimester } = req.query;
  let tips = [...HEALTH_TIPS];

  if (category) {
    tips = tips.filter(t => t.category === category);
  }
  if (trimester && trimester !== 'all') {
    tips = tips.filter(t => t.trimester === 'all' || t.trimester === trimester);
  }

  res.json({ success: true, count: tips.length, data: tips });
});

export default router;
