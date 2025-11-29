import { Router } from 'express';
import { Request, Response } from 'express';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { LogRepository } from '../repositories/logRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { query } from '../config/database';

const router = Router();
const appointmentRepo = new AppointmentRepository();
const logRepo = new LogRepository();

// All routes require authentication
router.use(authenticate);

// Get user's appointments
router.get('/my-appointments', async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const appointments = await appointmentRepo.fetchByUserId(userId);
  res.json(appointments);
});

// Create new appointment
router.post('/', async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { service_type, appointment_date, appointment_time, provider_id, notes } = req.body;

  if (!service_type || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // If no provider_id specified, get the first available provider
  let finalProviderId = provider_id;
  if (!finalProviderId) {
    const { rows } = await query("SELECT id FROM users WHERE role = 'provider' LIMIT 1");
    if (rows.length === 0) {
      return res.status(400).json({ message: 'No providers available' });
    }
    finalProviderId = rows[0].id;
  }

  try {
    const appointment = await appointmentRepo.create({
      user_id: userId,
      provider_id: finalProviderId,
      service_type,
      appointment_date,
      appointment_time,
      notes,
    });
    
    // Log the appointment creation
    await logRepo.create('appointment_created', {
      appointment_id: appointment.id,
      user_id: userId,
      provider_id: finalProviderId,
      service_type,
      appointment_date,
      appointment_time,
    });
    
    res.status(201).json(appointment);
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    res.status(400).json({ message: err.message || 'Failed to create appointment' });
  }
});

export default router;

