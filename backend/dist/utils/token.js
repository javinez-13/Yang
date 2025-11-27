"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = exports.signAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signAuthToken = (user) => jsonwebtoken_1.default.sign({
    email: user.email,
    fullName: user.fullName,
}, env_1.env.jwtSecret, {
    subject: user.id,
    expiresIn: '12h',
});
exports.signAuthToken = signAuthToken;
const verifyAuthToken = (token) => jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
exports.verifyAuthToken = verifyAuthToken;
//# sourceMappingURL=token.js.map