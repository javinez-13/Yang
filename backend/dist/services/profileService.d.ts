import { UserRepository } from '../repositories/userRepository';
export declare class ProfileService {
    private readonly userRepository;
    constructor(userRepository?: UserRepository);
    getProfile(userId: string): Promise<import("../types/user").PublicUser>;
    updateProfile(userId: string, data: Partial<{
        fullName: string;
        address: string;
        contactNumber: string;
        age: number;
    }>): Promise<import("../types/user").PublicUser>;
}
//# sourceMappingURL=profileService.d.ts.map