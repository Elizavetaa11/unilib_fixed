import express from "express";
import pool from "../config/db.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import { logOperation } from "../middleware/logger.js";

const router = express.Router();

function mapBookRow(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    year: row.year,
    pages: row.pages,
    illustrations: row.illustrations,
    price: row.price,
    branchId: row.branchId,
    branchName: row.branchName || null,
    copiesCount: row.copiesCount ?? 0,
    studentsCount: row.studentsCount ?? 0,
    faculties: row.faculties
      ? String(row.faculties).split(",").map(s => s.trim()).filter(Boolean)
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.title, a.full_name AS author, p.name AS publisher,
             b.year, b.pages, b.illustrations, b.price,
             b.branch_id AS branchId, br.name AS branchName,
             b.copies_count AS copiesCount, b.students_count AS studentsCount,
             GROUP_CONCAT(f.name SEPARATOR ',') AS faculties,
             b.created_at, b.updated_at
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN publishers p ON b.publisher_id = p.id
      JOIN branches br ON b.branch_id = br.id
      LEFT JOIN book_faculties bf ON b.id = bf.book_id
      LEFT JOIN faculties f ON bf.faculty_id = f.id
      GROUP BY b.id
    `);
    res.json(rows.map(mapBookRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [[row]] = await pool.query(`
      SELECT b.id, b.title, a.full_name AS author, p.name AS publisher,
             b.year, b.pages, b.illustrations, b.price,
             b.branch_id AS branchId, br.name AS branchName,
             b.copies_count AS copiesCount, b.students_count AS studentsCount,
             GROUP_CONCAT(f.name SEPARATOR ',') AS faculties,
             b.created_at, b.updated_at
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN publishers p ON b.publisher_id = p.id
      JOIN branches br ON b.branch_id = br.id
      LEFT JOIN book_faculties bf ON b.id = bf.book_id
      LEFT JOIN faculties f ON bf.faculty_id = f.id
      WHERE b.id = ?
      GROUP BY b.id
    `, [req.params.id]);
    if (!row) return res.status(404).json({ error: "Book not found" });
    res.json(mapBookRow(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

async function getOrCreate(table, field, value) {
  const [rows] = await pool.query(`SELECT id FROM ${table} WHERE ${field}=?`, [value]);
  if (rows.length) return rows[0].id;
  const [r] = await pool.query(`INSERT INTO ${table} (${field}) VALUES (?)`, [value]);
  return r.insertId;
}

router.post("/", authMiddleware, roleMiddleware(["admin", "librarian"]), async (req, res) => {
  try {
    const {
      title, author, publisher, year, pages, illustrations,
      price, branchId, copiesCount, studentsCount, faculties
    } = req.body;

    const authorId = await getOrCreate("authors", "full_name", author);
    const publisherId = await getOrCreate("publishers", "name", publisher);

    const [insertRes] = await pool.query(
      `INSERT INTO books (title, author_id, publisher_id, year, pages, illustrations, price, branch_id, copies_count, students_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, authorId, publisherId, year || null, pages || 0, illustrations || 0, price || 0, branchId || null, copiesCount || 1, studentsCount || 0]
    );
    const bookId = insertRes.insertId;

    let facNames = [];
    if (Array.isArray(faculties)) facNames = faculties;
    else if (typeof faculties === "string") facNames = faculties.split(",").map(s => s.trim()).filter(Boolean);

    for (const name of facNames) {
      const fid = await getOrCreate("faculties", "name", name);
      await pool.query("INSERT IGNORE INTO book_faculties (book_id, faculty_id) VALUES (?, ?)", [bookId, fid]);
    }

    await logOperation(req.user?.id, "CREATE", "books", bookId, null, { title }, "Create book", req.ip);
    res.json({ id: bookId, message: "Book created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, roleMiddleware(["admin", "librarian"]), async (req, res) => {
  try {
    const bookId = req.params.id;
    const {
      title, author, publisher, year, pages, illustrations,
      price, branchId, copiesCount, studentsCount, faculties
    } = req.body;

    const [[oldBook]] = await pool.query("SELECT * FROM books WHERE id = ?", [bookId]);
    if (!oldBook) return res.status(404).json({ error: "Book not found" });

    const authorId = await getOrCreate("authors", "full_name", author);
    const publisherId = await getOrCreate("publishers", "name", publisher);

    await pool.query(
      `UPDATE books 
       SET title=?, author_id=?, publisher_id=?, year=?, pages=?, illustrations=?, price=?, branch_id=?, copies_count=?, students_count=? 
       WHERE id=?`,
      [title, authorId, publisherId, year || null, pages || 0, illustrations || 0, price || 0, branchId || null, copiesCount || 1, studentsCount || 0, bookId]
    );

    await pool.query("DELETE FROM book_faculties WHERE book_id = ?", [bookId]);

    let facNames = [];
    if (Array.isArray(faculties)) facNames = faculties;
    else if (typeof faculties === "string") facNames = faculties.split(",").map(s => s.trim()).filter(Boolean);

    for (const name of facNames) {
      const fid = await getOrCreate("faculties", "name", name);
      await pool.query("INSERT IGNORE INTO book_faculties (book_id, faculty_id) VALUES (?, ?)", [bookId, fid]);
    }

    await logOperation(req.user?.id, "UPDATE", "books", bookId, oldBook, req.body, "Update book", req.ip);
    res.json({ success: true, message: "Book updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const [[oldBook]] = await pool.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (!oldBook) return res.status(404).json({ error: "Book not found" });

    await pool.query("DELETE FROM books WHERE id = ?", [req.params.id]);
    await logOperation(req.user?.id, "DELETE", "books", req.params.id, oldBook, null, "Delete book", req.ip);

    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
