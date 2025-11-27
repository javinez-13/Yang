import { DashboardRepository } from '../repositories/dashboardRepository';

export class DashboardService {
  constructor(private readonly dashboardRepository = new DashboardRepository()) {}

  async getSummary() {
    return this.dashboardRepository.fetchStats();
  }
}


