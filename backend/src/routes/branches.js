import express from "express";
import pool from "../config/db.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import { logOperation } from "../middleware/logger.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM branches");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM branches WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Branch not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/", authMiddleware, roleMiddleware(["admin", "librarian"]), async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const [result] = await pool.query(
      "INSERT INTO branches (name, address, phone) VALUES (?, ?, ?)",
      [name, address, phone]
    );

    await logOperation(req.user?.id, "CREATE", "branches", result.insertId, null, { name, address, phone }, "Create branch", req.ip);
    res.json({ id: result.insertId, message: "Branch created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", authMiddleware, roleMiddleware(["admin", "librarian"]), async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const [oldRows] = await pool.query("SELECT * FROM branches WHERE id = ?", [req.params.id]);
    if (!oldRows.length) return res.status(404).json({ error: "Branch not found" });

    await pool.query("UPDATE branches SET name=?, address=?, phone=? WHERE id=?", [name, address, phone, req.params.id]);
    await logOperation(req.user?.id, "UPDATE", "branches", req.params.id, oldRows[0], req.body, "Update branch", req.ip);

    res.json({ success: true, message: "Branch updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const [oldRows] = await pool.query("SELECT * FROM branches WHERE id = ?", [req.params.id]);
    if (!oldRows.length) return res.status(404).json({ error: "Branch not found" });

    await pool.query("DELETE FROM branches WHERE id = ?", [req.params.id]);
    await logOperation(req.user?.id, "DELETE", "branches", req.params.id, oldRows[0], null, "Delete branch", req.ip);

    res.json({ success: true, message: "Branch deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
