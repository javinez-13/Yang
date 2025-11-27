"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = (0, token_1.verifyAuthToken)(token);
        req.userId = payload.sub;
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authMiddleware.js.map