import { Request, Response } from 'express';
import { ProfileService } from '../services/profileService';

const profileService = new ProfileService();

export const getProfile = async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.userId!);
  res.json(profile);
};

export const updateProfile = async (req: Request, res: Response) => {
  const profile = await profileService.updateProfile(req.userId!, req.body);
  res.json(profile);
};

