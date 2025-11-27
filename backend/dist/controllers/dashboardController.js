"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const dashboardService_1 = require("../services/dashboardService");
const dashboardService = new dashboardService_1.DashboardService();
const getDashboardSummary = async (_req, res) => {
    const summary = await dashboardService.getSummary();
    res.json(summary);
};
exports.getDashboardSummary = getDashboardSummary;
//# sourceMappingURL=dashboardController.js.map