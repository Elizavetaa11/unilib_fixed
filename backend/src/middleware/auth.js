
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token error' });
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Bad token format' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No user' });
    if (allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  }
}
