
import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faculties');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, roleMiddleware(['admin','librarian']), async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO faculties (name) VALUES (?)', [name]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
