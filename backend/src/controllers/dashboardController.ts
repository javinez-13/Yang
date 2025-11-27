import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

const dashboardService = new DashboardService();

export const getDashboardSummary = async (_req: Request, res: Response) => {
  const summary = await dashboardService.getSummary();
  res.json(summary);
};


