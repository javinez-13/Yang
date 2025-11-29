import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LogRepository } from '../repositories/logRepository';

const authService = new AuthService();
const logRepo = new LogRepository();

export const signup = async (req: Request, res: Response) => {
  const { token, user } = await authService.signup(req.body);
  // Log user signup
  await logRepo.create('user_signed_up', {
    user_id: user.id,
    email: user.email,
    full_name: user.fullName,
  });
  res.status(201).json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const { token, user } = await authService.login(req.body);
  // Log user login
  await logRepo.create('user_logged_in', {
    user_id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
  });
  res.status(200).json({ token, user });
};

