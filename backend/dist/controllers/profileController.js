"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const profileService_1 = require("../services/profileService");
const profileService = new profileService_1.ProfileService();
const getProfile = async (req, res) => {
    const profile = await profileService.getProfile(req.userId);
    res.json(profile);
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const profile = await profileService.updateProfile(req.userId, req.body);
    res.json(profile);
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=profileController.js.map