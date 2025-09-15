import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Проверка авторизации
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Нет токена" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // добавляем данные о пользователе в req
    next();
  } catch (err) {
    return res.status(403).json({ error: "Неверный или просроченный токен" });
  }
};

// Проверка роли (admin / librarian)
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }
    next();
  };
};
