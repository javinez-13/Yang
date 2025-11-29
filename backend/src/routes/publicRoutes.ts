import { Router } from 'express';
import { EventRepository } from '../repositories/eventRepository';
import { OrgUnitRepository } from '../repositories/orgUnitRepository';
import { ProviderAvailabilityRepository } from '../repositories/providerAvailabilityRepository';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const eventRepo = new EventRepository();
const orgUnitRepo = new OrgUnitRepository();
const providerAvailabilityRepo = new ProviderAvailabilityRepository();

// Public routes - require authentication but not admin
router.use(authenticate);

// Get all events (for user dashboard)
router.get('/events', async (_req, res) => {
  const events = await eventRepo.findAll();
  res.json(events);
});

// Get organizational chart (for user view)
router.get('/org-chart', async (_req, res) => {
  const units = await orgUnitRepo.findAll();
  res.json(units);
});

// Get provider schedules (for user booking)
router.get('/schedules', async (_req, res) => {
  const schedules = await providerAvailabilityRepo.findAll();
  res.json(schedules);
});

export default router;

