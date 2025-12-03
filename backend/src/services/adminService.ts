import { EventRepository } from '../repositories/eventRepository';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { LogRepository } from '../repositories/logRepository';
import { OrgUnitRepository } from '../repositories/orgUnitRepository';
import { ProviderAvailabilityRepository } from '../repositories/providerAvailabilityRepository';
import { RestrictedSlotRepository } from '../repositories/restrictedSlotRepository';
import { UserRepository } from '../repositories/userRepository';

export class AdminService {
  constructor(
    private readonly eventRepo = new EventRepository(),
    private readonly appointmentRepo = new AppointmentRepository(),
    private readonly logRepo = new LogRepository(),
    private readonly orgUnitRepo = new OrgUnitRepository(),
    private readonly providerAvailabilityRepo = new ProviderAvailabilityRepository(),
    private readonly restrictedSlotRepo = new RestrictedSlotRepository(),
    private readonly userRepo = new UserRepository(),
  ) {}

  async listEvents() {
    return this.eventRepo.findAll();
  }

  async createEvent(payload: { title: string; description?: string; event_date: string; location?: string }) {
    const created = await this.eventRepo.create(payload);
    await this.logRepo.create('event_created', created);
    return created;
  }

  async updateEvent(id: string, payload: any) {
    const updated = await this.eventRepo.update(id, payload);
    await this.logRepo.create('event_updated', { id, ...payload });
    return updated;
  }

  async deleteEvent(id: string) {
    await this.eventRepo.delete(id);
    await this.logRepo.create('event_deleted', { id });
    return true;
  }

  async listAppointments() {
    return this.appointmentRepo.fetchAll();
  }

  async updateAppointmentStatus(id: string, status: string) {
    const updated = await this.appointmentRepo.updateStatus(id, status);
    await this.logRepo.create('appointment_status_changed', { id, status });
    return updated;
  }

  async listLogs(limit?: number) {
    return this.logRepo.fetchAll(limit);
  }

  async clearLogs() {
    await this.logRepo.clearAll();
    return true;
  }

  // Organizational Chart Management
  async listOrgUnits() {
    return this.orgUnitRepo.findAll();
  }

  async createOrgUnit(payload: { name: string; description?: string; parent_id?: number | null }) {
    const created = await this.orgUnitRepo.create(payload);
    await this.logRepo.create('org_unit_created', created);
    return created;
  }

  async updateOrgUnit(id: string, payload: any) {
    const updated = await this.orgUnitRepo.update(id, payload);
    await this.logRepo.create('org_unit_updated', { id, ...payload });
    return updated;
  }

  async deleteOrgUnit(id: string) {
    await this.orgUnitRepo.delete(id);
    await this.logRepo.create('org_unit_deleted', { id });
    return true;
  }

  // Schedule Management
  async listSchedules() {
    return this.providerAvailabilityRepo.findAll();
  }

  async createSchedule(payload: { provider_id: string | number; day_of_week: number; start_time: string; end_time: string }) {
    const created = await this.providerAvailabilityRepo.create(payload);
    await this.logRepo.create('schedule_created', created);
    return created;
  }

  async updateSchedule(id: string, payload: any) {
    // Only allow updating time fields when editing
    const updatePayload: any = {};
    if (payload.start_time !== undefined) updatePayload.start_time = payload.start_time;
    if (payload.end_time !== undefined) updatePayload.end_time = payload.end_time;
    // Do not allow updating provider_id or day_of_week when editing
    
    const updated = await this.providerAvailabilityRepo.update(id, updatePayload);
    await this.logRepo.create('schedule_updated', { id, ...updatePayload });
    return updated;
  }

  async deleteSchedule(id: string) {
    await this.providerAvailabilityRepo.delete(id);
    await this.logRepo.create('schedule_deleted', { id });
    return true;
  }

  // Get providers list
  async listProviders() {
    const { query } = await import('../config/database');
    const { rows } = await query("SELECT id, full_name, email, role FROM users WHERE role = 'provider' ORDER BY full_name");
    return rows.map((row: any) => ({
      id: row.id, // Keep as string for UUID, or number for SERIAL
      full_name: row.full_name,
      email: row.email,
      role: row.role,
    }));
  }

  // Restricted Time Slots
  async listRestrictedSlots() {
    return this.restrictedSlotRepo.findAll();
  }

  async createRestrictedSlot(payload: { provider_id: string | number; day_of_week: number; time: string }) {
    // Check if slot already exists
    const existing = await this.restrictedSlotRepo.findOne(payload.provider_id, payload.day_of_week, payload.time);
    if (existing) {
      throw new Error('This time slot is already restricted');
    }
    const created = await this.restrictedSlotRepo.create(payload);
    await this.logRepo.create('time_slot_restricted', created);
    return created;
  }

  async deleteRestrictedSlot(providerId: string | number, dayOfWeek: number, time: string) {
    await this.restrictedSlotRepo.delete(providerId, dayOfWeek, time);
    await this.logRepo.create('time_slot_unrestricted', { provider_id: providerId, day_of_week: dayOfWeek, time });
    return true;
  }
}
