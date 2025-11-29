import { Router } from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  listAppointments,
  updateAppointmentStatus,
  getLogs,
  getOrgUnits,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getProviders,
} from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/adminMiddleware';

const router = Router();

// protect all admin routes
router.use(authenticate, requireAdmin);

// events
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// appointments
router.get('/appointments', listAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// logs
router.get('/logs', getLogs);

// organizational chart
router.get('/org-chart', getOrgUnits);
router.post('/org-chart', createOrgUnit);
router.put('/org-chart/:id', updateOrgUnit);
router.delete('/org-chart/:id', deleteOrgUnit);

// schedules
router.get('/schedules', getSchedules);
router.post('/schedules', createSchedule);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

// providers
router.get('/providers', getProviders);

export default router;
