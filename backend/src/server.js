import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import booksRouter from './routes/books.js';
import branchesRouter from './routes/branches.js';
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import loansRouter from './routes/loans.js';
import facultiesRouter from './routes/faculties.js';
import apRouter from './routes/authors_publishers.js';
import reportsRouter from './routes/reports.js';
import usersRouter from './routes/users.js'; // Добавили

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/branches', branchesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/loans', loansRouter);
app.use('/api/faculties', facultiesRouter);
app.use('/api/ap', apRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/users', usersRouter); // Подключили

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
