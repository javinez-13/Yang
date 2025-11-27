"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/summary', authMiddleware_1.authenticate, dashboardController_1.getDashboardSummary);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map