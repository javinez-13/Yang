import { DashboardRepository } from '../repositories/dashboardRepository';
export declare class DashboardService {
    private readonly dashboardRepository;
    constructor(dashboardRepository?: DashboardRepository);
    getSummary(): Promise<import("../repositories/dashboardRepository").DashboardStats>;
}
//# sourceMappingURL=dashboardService.d.ts.map