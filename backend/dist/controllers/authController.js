"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
const signup = async (req, res) => {
    const { token, user } = await authService.signup(req.body);
    res.status(201).json({ token, user });
};
exports.signup = signup;
const login = async (req, res) => {
    const { token, user } = await authService.login(req.body);
    res.status(200).json({ token, user });
};
exports.login = login;
//# sourceMappingURL=authController.js.map