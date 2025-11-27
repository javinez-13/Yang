"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const userRepository_1 = require("../repositories/userRepository");
class ProfileService {
    constructor(userRepository = new userRepository_1.UserRepository()) {
        this.userRepository = userRepository;
    }
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.toPublic(user);
    }
    async updateProfile(userId, data) {
        const updated = await this.userRepository.updateProfile(userId, data);
        if (!updated) {
            throw new Error('Unable to update profile');
        }
        return updated;
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profileService.js.map