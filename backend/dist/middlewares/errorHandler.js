"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(400).json({ message: err.message || 'Something went wrong' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map