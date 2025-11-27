import { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../utils/token';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAuthToken(token);
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

