import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

const adminService = new AdminService();

export const getEvents = async (_req: Request, res: Response) => {
  const events = await adminService.listEvents();
  res.json(events);
};

export const createEvent = async (req: Request, res: Response) => {
  const data = req.body;
  const created = await adminService.createEvent(data);
  res.status(201).json(created);
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updated = await adminService.updateEvent(id, req.body);
  res.json(updated);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id!;
  await adminService.deleteEvent(id);
  res.status(204).send();
};

export const listAppointments = async (_req: Request, res: Response) => {
  const rows = await adminService.listAppointments();
  res.json(rows);
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const { status } = req.body;
  const updated = await adminService.updateAppointmentStatus(id, status);
  res.json(updated);
};

export const getLogs = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 200;
  const logs = await adminService.listLogs(limit);
  res.json(logs);
};

// Organizational Chart
export const getOrgUnits = async (_req: Request, res: Response) => {
  const units = await adminService.listOrgUnits();
  res.json(units);
};

export const createOrgUnit = async (req: Request, res: Response) => {
  const data = req.body;
  const created = await adminService.createOrgUnit(data);
  res.status(201).json(created);
};

export const updateOrgUnit = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updated = await adminService.updateOrgUnit(id, req.body);
  res.json(updated);
};

export const deleteOrgUnit = async (req: Request, res: Response) => {
  const id = req.params.id!;
  await adminService.deleteOrgUnit(id);
  res.status(204).send();
};

// Schedules
export const getSchedules = async (_req: Request, res: Response) => {
  const schedules = await adminService.listSchedules();
  res.json(schedules);
};

export const createSchedule = async (req: Request, res: Response) => {
  const data = req.body;
  const created = await adminService.createSchedule(data);
  res.status(201).json(created);
};

export const updateSchedule = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updated = await adminService.updateSchedule(id, req.body);
  res.json(updated);
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const id = req.params.id!;
  await adminService.deleteSchedule(id);
  res.status(204).send();
};

// Providers
export const getProviders = async (_req: Request, res: Response) => {
  const providers = await adminService.listProviders();
  res.json(providers);
};