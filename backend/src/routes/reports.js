
import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

router.get('/book-copies', async (req, res) => {
  const { book_id, branch_id } = req.query;
  if (!book_id || !branch_id) return res.status(400).json({ error: 'book_id and branch_id required' });
  try {

    const [rows] = await pool.query('SELECT GetBookCopiesInBranch(?, ?) as copies', [book_id, branch_id]);
    if (rows && rows.length) return res.json({ copies: rows[0].copies });

    const [[r2]] = await pool.query('SELECT COALESCE(SUM(copies_count),0) as copies FROM books WHERE id = ? AND branch_id = ?', [book_id, branch_id]);
    res.json({ copies: r2.copies });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/book-faculties', async (req, res) => {
  const { book_id, branch_id } = req.query;
  if (!book_id || !branch_id) return res.status(400).json({ error: 'book_id and branch_id required' });
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT f.id, f.name FROM book_faculties bf
       JOIN faculties f ON bf.faculty_id = f.id
       JOIN books b ON bf.book_id = b.id
       WHERE bf.book_id = ? AND b.branch_id = ?`,
      [book_id, branch_id]
    );
    res.json({ count: rows.length, faculties: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
