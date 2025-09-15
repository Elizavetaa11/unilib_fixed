
import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { logOperation } from '../middleware/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authMiddleware, roleMiddleware(['admin','librarian']), async (req, res) => {
  const { full_name, faculty_id, student_number } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO students (full_name, faculty_id, student_number) VALUES (?, ?, ?)', [full_name, faculty_id, student_number]);
    await logOperation(req.user.id, 'CREATE', 'students', result.insertId, null, { full_name, faculty_id, student_number }, 'Create student', req.ip);
    res.json({ id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
