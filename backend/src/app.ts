import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import adminRoutes from './routes/adminRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import publicRoutes from './routes/publicRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', publicRoutes);

app.use(errorHandler);

export default app;

