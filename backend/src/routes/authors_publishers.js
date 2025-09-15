
import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

router.get('/authors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM authors');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/publishers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM publishers');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
