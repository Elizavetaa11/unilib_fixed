
import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { logOperation } from '../middleware/logger.js';

const router = express.Router();


router.post('/issue', authMiddleware, roleMiddleware(['admin','librarian']), async (req, res) => {
  const { book_id, student_id, due_date } = req.body;
  try {

    const [[book]] = await pool.query('SELECT * FROM books WHERE id = ?', [book_id]);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.copies_count <= 0) return res.status(400).json({ error: 'No copies available' });

    const [result] = await pool.query('INSERT INTO book_loans (book_id, student_id, loan_date, due_date, status) VALUES (?, ?, CURDATE(), ?, ?)', [book_id, student_id, due_date, 'active']);

    await pool.query('UPDATE books SET copies_count = copies_count - 1 WHERE id = ?', [book_id]);

    await pool.query('UPDATE books SET students_count = (SELECT COUNT(DISTINCT student_id) FROM book_loans WHERE book_id = ?) WHERE id = ?', [book_id, book_id]);
    await logOperation(req.user.id, 'CREATE', 'book_loans', result.insertId, null, { book_id, student_id, due_date }, 'Issue book', req.ip);
    res.json({ id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.post('/return', authMiddleware, roleMiddleware(['admin','librarian']), async (req, res) => {
  const { loan_id } = req.body;
  try {
    const [[loan]] = await pool.query('SELECT * FROM book_loans WHERE id = ?', [loan_id]);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'active') return res.status(400).json({ error: 'Loan not active' });
    await pool.query('UPDATE book_loans SET status = ?, return_date = CURDATE() WHERE id = ?', ['returned', loan_id]);

    await pool.query('UPDATE books SET copies_count = copies_count + 1 WHERE id = ?', [loan.book_id]);
    await pool.query('UPDATE books SET students_count = (SELECT COUNT(DISTINCT student_id) FROM book_loans WHERE book_id = ?) WHERE id = ?', [loan.book_id, loan.book_id]);
    await logOperation(req.user.id, 'UPDATE', 'book_loans', loan_id, loan, { status: 'returned' }, 'Return book', req.ip);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
