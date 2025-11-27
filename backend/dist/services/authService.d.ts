import { UserRepository } from '../repositories/userRepository';
import { CreateUserInput } from '../types/user';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository?: UserRepository);
    signup(input: CreateUserInput): Promise<{
        token: string;
        user: import("../types/user").PublicUser;
    }>;
    login(input: Pick<CreateUserInput, 'email' | 'password'>): Promise<{
        token: string;
        user: import("../types/user").PublicUser;
    }>;
}
//# sourceMappingURL=authService.d.ts.map