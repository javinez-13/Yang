"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const zod_1 = require("zod");
const userRepository_1 = require("../repositories/userRepository");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const signupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    address: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    age: zod_1.z.number().int().positive().max(120).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
class AuthService {
    constructor(userRepository = new userRepository_1.UserRepository()) {
        this.userRepository = userRepository;
    }
    async signup(input) {
        let payload;
        try {
            payload = signupSchema.parse(input);
        }
        catch (error) {
            throw new Error(error.issues.map((issue) => issue.message).join(', '));
        }
        const existing = await this.userRepository.findByEmail(payload.email);
        if (existing) {
            throw new Error('Email is already registered');
        }
        const passwordHash = await (0, password_1.hashPassword)(payload.password);
        const user = await this.userRepository.createUser({
            ...payload,
            passwordHash,
        });
        const token = (0, token_1.signAuthToken)(this.userRepository.toPublic(user));
        return {
            token,
            user: this.userRepository.toPublic(user),
        };
    }
    async login(input) {
        let payload;
        try {
            payload = loginSchema.parse(input);
        }
        catch (error) {
            throw new Error(error.issues.map((issue) => issue.message).join(', '));
        }
        const user = await this.userRepository.findByEmail(payload.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValid = await (0, password_1.comparePassword)(payload.password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }
        const token = (0, token_1.signAuthToken)(this.userRepository.toPublic(user));
        return {
            token,
            user: this.userRepository.toPublic(user),
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map