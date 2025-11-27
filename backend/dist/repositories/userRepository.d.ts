import { CreateUserInput, PublicUser, User } from '../types/user';
export declare class UserRepository {
    createUser(payload: CreateUserInput & {
        passwordHash: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateProfile(id: string, data: Partial<Pick<CreateUserInput, 'fullName' | 'address' | 'contactNumber' | 'age'>>): Promise<PublicUser | null>;
    toPublic(user: User): PublicUser;
}
//# sourceMappingURL=userRepository.d.ts.map