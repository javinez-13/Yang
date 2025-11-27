import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const signup = async (req: Request, res: Response) => {
  const { token, user } = await authService.signup(req.body);
  res.status(201).json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const { token, user } = await authService.login(req.body);
  res.status(200).json({ token, user });
};

