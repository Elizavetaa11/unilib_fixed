UniLib backend
===============

How to run:
1. Copy .env.example to .env and set DB credentials and JWT_SECRET
2. cd backend
3. npm install
4. npm run dev  (or npm start)

APIs:
- POST /api/auth/login  { username, password }
- GET  /api/books
- GET  /api/books/:id
- POST /api/books  (admin/librarian)
- PUT  /api/books/:id (admin/librarian)
- DELETE /api/books/:id (admin)
- GET  /api/branches ...
- POST /api/loans/issue  {book_id, student_id, due_date}
- POST /api/loans/return {loan_id}
- GET  /api/reports/book-copies?book_id=...&branch_id=...
- GET  /api/reports/book-faculties?book_id=...&branch_id=...