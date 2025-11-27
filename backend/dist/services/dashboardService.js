"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const dashboardRepository_1 = require("../repositories/dashboardRepository");
class DashboardService {
    constructor(dashboardRepository = new dashboardRepository_1.DashboardRepository()) {
        this.dashboardRepository = dashboardRepository;
    }
    async getSummary() {
        return this.dashboardRepository.fetchStats();
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboardService.js.map