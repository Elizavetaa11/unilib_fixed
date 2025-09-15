
import pool from '../config/db.js';

export async function logOperation(userId, operationType, tableName, recordId, oldValues, newValues, description, ip) {
  try {
    await pool.query(
      `INSERT INTO operation_logs (user_id, operation_type, table_name, record_id, old_values, new_values, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, operationType, tableName, recordId || null, JSON.stringify(oldValues || null), JSON.stringify(newValues || null), description || null, ip || null]
    );
  } catch (err) {
    console.error('Log error', err.message);
  }
}
