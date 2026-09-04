import express from 'express';
import { db } from '../services/dbService.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const users = await db.find('users');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Use demo accounts.' });
    }

    // Return safe user object (omit raw password)
    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
      token: `demo-token-${user.id}`
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/users (Demo user selector)
router.get('/users', async (req, res, next) => {
  try {
    const users = await db.find('users');
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.json({ success: true, data: safeUsers });
  } catch (err) {
    next(err);
  }
});

export default router;
