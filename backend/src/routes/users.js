import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Получить всех пользователей (только admin)
router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, full_name, email, is_active FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("Ошибка получения пользователей:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавить пользователя (только admin)
router.post("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { username, password_hash, role, full_name, email, is_active } = req.body;

    if (!username || !password_hash) {
      return res.status(400).json({ error: "Логин и пароль обязательны" });
    }

    // Проверяем уникальность username
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким логином уже существует" });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    await pool.query(
      "INSERT INTO users (username, password_hash, role, full_name, email, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [username, hashedPassword, role || "librarian", full_name || "", email || "", is_active ?? true]
    );

    res.status(201).json({ message: "Пользователь успешно создан" });
  } catch (err) {
    console.error("Ошибка при создании пользователя:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Смена пароля (admin может менять любому, librarian только себе)
router.put("/:username/password", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Пароль обязателен" });
    }

    // Проверяем права: библиотекарь может менять пароль только себе
    if (req.user.role !== "admin" && req.user.username !== username) {
      return res.status(403).json({ error: "Нет прав" });
    }

    // Проверяем, что пользователь существует
    const [users] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE username = ?", [
      hashedPassword,
      username,
    ]);

    res.json({ message: "Пароль успешно изменён" });
  } catch (err) {
    console.error("Ошибка при смене пароля:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить пользователя (только admin)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    console.error("Ошибка при удалении пользователя:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
