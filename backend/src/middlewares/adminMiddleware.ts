import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { rows } = await query('SELECT role FROM users WHERE id = $1 LIMIT 1', [userId]);
    const role = rows[0]?.role;
    if (role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Unable to verify admin' });
  }
};
